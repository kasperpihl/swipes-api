var pg = require('pg');
var _ = require('underscore');
var conString = process.env.DATABASE_URL ? process.env.DATABASE_URL : "postgres://kasper:tornoe89@localhost/postgres";
var sql = require('./pg-sql.js');
var PgBatcher = require('./pg_batcher.js');
var Queue = require('./queue.js');

function Postgres(logger){
	this.logger = logger;
	this.client = false;
};
Postgres.prototype.performQueries = function (queries, callback){
	if ( !queries || !_.isArray(queries) || queries.length == 0 )
		return callback( false, "no queries provided" );
	var i = 0, target = queries.length, returnArr = {};	
	var self = this;
	function next(){
		if ( i == target )
			return callback( returnArr, false );

		var query = queries[ i ];
		self.client.query( query.text , query.values , function ( err, result ){
			if ( err )
				return callback( false, err );
			if(!query.name)
				query.name = ""+i;
			returnArr[query.name] = result.rows;
			i++;
			next();
		});
	}
	next();
};

Postgres.prototype.test = function(time,callback){
	if ( !time ) 
		time = "2014-05-09T14:51:48.119Z";
	var date = new Date(time);
	console.log(date);
	var client = new pg.Client(conString);
	client.connect(function(err) {
		if(err) 
			return console.error('could not connect to postgres', err);
		logger.time('connected client');
		var todo = sql.todo();
		var query = todo.select(todo.star()).where(todo.updatedAt.gt(date)).toQuery();
		client.query(query.text,query.values,function(err, result) {
			if(err) {
				return console.error('error running query', err);
			}
			console.log(result.rows.length);
			//console.log(result);
			callback();
		});
	});
	
};


Postgres.prototype.sync = function ( body, userId, callback ){

	if ( !userId )
		return callback( false, errorReturn('You have to be logged in') );
	if(body.objects && !_.isObject(body.objects)) 
		return callback(false,errorReturn('Objects must be object or array'));

	var self = this;
	var requestStartTime = new Date();
	var batcher = new PgBatcher();
  	self.logger.time('ready to sort');
  	batcher.sortObjects(body.objects,userId);
  	self.logger.time('sorted objects');
  	
  	var collection = batcher.getCollection();
  	//var insertions = batcher.insertions();
  	//var updates = batcher.updates();

	var client = new pg.Client(conString);
	var resultObjects = {};

	var queue = new Queue();
	queue.set('recurring',1);

	function connect(){
		client.connect(function(err) {
			self.client = client;
			if(err) 
				return console.error('could not connect to postgres', err);
			self.logger.time('connected client');
			checkDuplicates();

		});
	}

	function checkDuplicates(){
		queue.reset();
		var localIds = batcher.getLocalIds();
		var columns = [ 'id' , 'localId' ];
		var todo = sql.todo();
		var tag = sql.tag();

		queue.push ( { "table" : tag, objects : localIds[ 'Tag' ] , className: "Tag" } );
		queue.push ( { "table" : todo , objects : localIds[ 'ToDo' ] , className: "ToDo" } );
		queue.run( function( obj ){
			//logger.log("checking " + obj.className + " duplicates for: " + (obj.objects ? obj.objects.length : 0));
			if ( !obj.objects || obj.objects.length == 0 )
				return queue.next();

			var query = obj.table.select(obj.table.id,obj.table.localId).from(obj.table).where(obj.table.userId.equals(userId).and(obj.table.localId.in(obj.objects))).toQuery();
			//console.log(query);

			client.query(query.text,query.values,function(err, result) {
				if(result && result.rows){
					//console.log("resulted with "+ result.rows.length + " duplicates");
					for( var i = 0 ; i < result.rows.length ; i++ ){
						var localId = result.rows[i].localId;
						var id = result.rows[i].id;
						var object = collection[obj.className][localId];
						object.id = id;
						//console.log(object.updates);
						//delete object.updates["localId"];
						//delete object.updates["userId"];
						object.action = 'update';
					}
				}
				if(err)
					console.log(err);
				//console.log(result);
				queue.next();
			});
		},function(finished){
			self.logger.time('checked duplicates');
			saveObjects();
		});
	};

	var relationCollection = {};
	function saveObjects(){
		var batch = batcher.batch();
		console.log(batch);
		queue.reset();
		queue.push( batch.insertions );
		queue.push( batch.updates.Tag, true );
		queue.push( batch.updates.ToDo, true );
		queue.run(function(customObject, counter){
			console.log(counter);
			/* Queue runs all insertions at once to optimize query speed*/
			if ( counter == 0 ){
				batchInsertions(customObject,function(result,error){
					if(error)
						console.log(error);
					else queue.next();
				});
			}
			else{
				saveObject(customObject, function( result, err ){
					if(!err)
						queue.next();
					else
						console.log(err);
				});
			}
		},function(finished){
			self.logger.time("saved objects");
			//getUpdates();
			handleRelations();
		});
	};
	function batchInsertions(insertions, callback){
		var queries = new Array();
		var tagQuery = sql.tag(), added = false;

		for ( var i in insertions.Tag ){
			added = true;
			var customObject = insertions.Tag[ i ];
			tagQuery = tagQuery.insert( customObject.updates );
		}
		if ( added )
			queries.push( tagQuery.toNamedQuery( "tags" ) );

		var todoQuery = sql.todo(), added = false;
		for ( var i in insertions.ToDo ){
			added = true;
			var customObject = insertions.ToDo[ i ];
			todoQuery = todoQuery.insert( customObject.updates );
		}
		if ( added )
			queries.push( todoQuery.toNamedQuery( "todos" ) );
		if ( queries.length > 0) {
			self.performQueries(queries, function(result,error){
				callback(result,error);
			});
		}
		else 
			callback(false,false);
	};
	function saveObject(customObject, callback){
		var query;
		var model = customObject.sqlModel;
		if(customObject.action == 'insert'){
			query = model.insert(customObject.updates).toQuery();
			console.log(query.text);
		}
		else{
			query = model.update(customObject.updates).where(model.id.equals(customObject.id)).returning(model.id).toQuery();
		}

		client.query(query.text,query.values, function(err, result) {
			if(err) {
				return callback(false, err);
			}
			else callback(true, false);

		});
	};
	function handleRelations(){
		var relations = batcher.getRelations();
		var todosToUpdate = _.keys(relations.tags);
		if(todosToUpdate.length == 0)
			return getUpdates();

		var tagKey = "tag", todoKey = "todo";
		var tagModel = sql.tag(), todo = sql.todo();
		
		// TODO: use transactions here
		var tagQuery = tagModel.select(tagModel.id,tagModel.localId).where(tagModel.userId.equals(userId)).toNamedQuery(tagKey);
		var todoQuery = todo.update({"tagsLastUpdate":"now()", "updatedAt": "now()" }).where(todo.userId.equals(userId).and(todo.localId.in(todosToUpdate))).returning(todo.id,todo.localId).toNamedQuery(todoKey);
		self.performQueries([tagQuery,todoQuery],function(result,error){
			if(error) 
				console.log(error);
			var lookup = { };
			lookup[tagKey] = {};
			lookup[todoKey] = {};

			var todo_tag = sql.todo_tag();

			var queries = new Array();
			var updatedToDoIds = new Array();
			for ( var className in result ){
				var isTodo = ( className == todoKey ); 
				for ( var index in result[ className ] ){
					var obj = result[ className ][ index ];
					var identifier = obj.id;
					lookup[ className ][ obj.localId ] = identifier;
					if ( isTodo )
						updatedToDoIds.push( identifier );
				}
			}

			var deleteTagRelationQuery = todo_tag['delete']().where( todo_tag.userId.equals( userId ).and( todo_tag.todoId.in( updatedToDoIds ) ) ).toQuery();
			queries.push(deleteTagRelationQuery);
			var insertTagRelationQuery = sql.todo_tag(), added = false;
			for ( var todoLocalId in relations.tags ){
				var tagsToUpdate = relations.tags[ todoLocalId ];
				var todoId = lookup[ todoKey ][ todoLocalId ];
				if ( !todoId )
					continue;
				var order = 1;
				for ( var i in tagsToUpdate ){
					var tagLocalId = tagsToUpdate[ i ];
					var tagId = lookup[ tagKey ][ tagLocalId ];
					if ( tagId ){
						insertTagRelationQuery = insertTagRelationQuery.insert( { "userId" : userId , "todoId": todoId , "tagId": tagId , "order": order } );
						order++;
						added = true;
					}

				}
			}
			if ( added )
				queries.push( insertTagRelationQuery.toNamedQuery( 'todo_tag' ) );
			self.performQueries( queries, function( result, error){
				if(error)
					console.log(error);
				getUpdates();
			});
		});
	};

	function getUpdates(){
		
		var lastUpdate = (body.lastUpdate) ? new Date(body.lastUpdate) : false;

		queue.reset();
		var todo = sql.todo();
		var tag = sql.tag();
		var todo_tag = sql.todo_tag();
		var where = lastUpdate ? todo_tag.userId.equals(userId).and(todo.tagsLastUpdate.gt(lastUpdate)) : todo_tag.userId.equals(userId);
		var todosWithRelation = todo_tag.leftJoin( todo ).on( todo_tag.todoId.equals( todo.id ) ).leftJoin( tag ).on( todo_tag.tagId.equals( tag.id ) );
		var todoTagQuery = todo_tag.select( todo.localId.as("todoLocalId") , tag.localId.as("tagLocalId"), todo_tag.order ).from(todosWithRelation).where(where).order(todo.localId,todo_tag.order).toNamedQuery("todo_tags");
		
		

		where = lastUpdate ? tag.userId.equals( userId ).and( tag.updatedAt.gt( lastUpdate ) ) : tag.userId.equals( userId );
		var tagQuery = tag.select.apply( tag,sql.retColumns( tag ) ).where( where ).toNamedQuery( "Tag" );
		
		where = lastUpdate ? todo.userId.equals( userId ).and( todo.updatedAt.gt( lastUpdate ) ) : todo.userId.equals( userId );
		var toDoQuery = todo.select.apply( todo,sql.retColumns( todo ) ).where( where ).toNamedQuery( "ToDo" );
		var queries = [tagQuery, todoTagQuery, toDoQuery];

		self.performQueries(queries, function(result, error){
			if(error) 
				console.log(error);
			var relations = {};
			if(result["todo_tags"] && result.todo_tags.length > 0){
				console.log(result["todo_tags"]);
				for(var i in result.todo_tags){
					var tagRelation = result.todo_tags[i];
					if(!relations[tagRelation.todoLocalId])
						relations[tagRelation.todoLocalId] = [];
					relations[tagRelation.todoLocalId].push({objectId:tagRelation.tagLocalId});
				}
			}
			var biggestTime;
			for(var className in result){
				if(!(className == "Tag" || className == "ToDo"))
					continue;
				var isTodo = (className == "ToDo");
				for(var index in result[className]){
					var localObj = result[className][index];
					if(!biggestTime || localObj.updatedAt > biggestTime)
						biggestTime = localObj.updatedAt;
					if(isTodo && relations[localObj.objectId]){
						localObj["tags"] = relations[localObj.objectId];
						console.log(relations[localObj.objectId]);
					}
					sql.parseObjectForClass(localObj,className);
				}
				resultObjects[className] = result[className];
			}
			//console.log(result);
			finish(biggestTime);
		});
		
	};
	function finish(biggestTime){
		self.logger.time('finished query');
		self.client.end();
		resultObjects.serverTime = new Date().toISOString();
		if(biggestTime)
			resultObjects.updateTime = biggestTime.toISOString();
      	callback(resultObjects,false);
	};
	connect();
};

module.exports = Postgres;