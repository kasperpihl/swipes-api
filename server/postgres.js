var pg = require('pg');
var _ = require('underscore');
var logger = require('./logger.js');
var conString = process.env.DATABASE_URL ? process.env.DATABASE_URL : "postgres://kasper:tornoe89@localhost/postgres";
var sql = require('./pg-sql.js');

exports.test = function(time,callback){
	if(!time) 
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

exports.sync = function ( body, userId, callback ){

	if ( !userId )
		return callback( false, errorReturn('You have to be logged in') );
	if(body.objects && !_.isObject(body.objects)) 
		return callback(false,errorReturn('Objects must be object or array'));

	var requestStartTime = new Date();
	var batcher = require('./pg-batcher.js');
  	batcher.reset();
  	logger.time('ready to sort');
  	batcher.sortObjects(body.objects,userId);
  	logger.time('sorted objects');
  	
  	var collection = batcher.collection();
  	//var insertions = batcher.insertions();
  	//var updates = batcher.updates();

	var client = new pg.Client(conString);
	var resultObjects = {};

	var queue = require('./queue.js');
	queue.set('recurring',1);

	function connect(){
		client.connect(function(err) {
			if(err) 
				return console.error('could not connect to postgres', err);
			logger.time('connected client');
			checkDuplicates();

		});
	}
	function checkDuplicates(){
		queue.reset();
		var localIds = batcher.localIds();
		var columns = ['id','localId'];
		var todo = sql.todo();
		var tag = sql.tag();
		queue.push ( { "table" : tag, objects : localIds[ 'Tag' ] , className: "Tag" } );
		queue.push ( { "table" : todo , objects : localIds[ 'ToDo' ] , className: "ToDo" } );
		queue.run(function(obj){
			//logger.log("checking " + obj.className + " duplicates for: " + (obj.objects ? obj.objects.length : 0));
			if(!obj.objects || obj.objects.length == 0)
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
			logger.time('checked duplicates');
			saveObjects();
		});
	};
	function saveObjects(){
		var batch = batcher.batch();
		queue.reset();
		queue.push( batch , true );
		queue.run(function(customObject){
			var query;
			var model = customObject.sqlModel;
			if(customObject.action == 'insert'){
				query = model.insert(customObject.updates).toQuery();
			}
			else{
				query = model.update(customObject.updates).where(model.id.equals(customObject.id)).toQuery();
			}
			//console.log(query);
			//console.log("saving obj " + customObject.localId);
			client.query(query.text,query.values, function(err, result) {
				if(err) {
					return console.error('error running query', err);
				}
				//console.log('success');
				//console.log("resulted query");
				//console.log(result);
				//output: Tue Jan 15 2013 19:12:47 GMT-600 (CST)
				queue.next();//
			});
		},function(finished){
			logger.time("saved objects");
			getUpdates();
		});
	};
	function getUpdates(){
		
		var lastUpdate = (body.lastUpdate) ? new Date(body.lastUpdate) : false;

		queue.reset();
		var todo = sql.todo();
		var tag = sql.tag();
		queue.push ( { "table" : tag, className: "Tag" } );
		queue.push ( { "table" : todo, className: "ToDo" } );
		var biggestTime;
		queue.run(function(obj){
			var where = lastUpdate ? obj.table.userId.equals(userId).and(obj.table.updatedAt.gt(lastUpdate)) : obj.table.userId.equals(userId); 
			var query = obj.table.select.apply(obj.table,sql.retColumns(obj.table)).where(where).toQuery();//
			client.query(query.text,query.values,function(err, result) {
				if(err) {
					return console.error('error running query', err);
				}
				for( var index in result.rows){
					var localObj = result.rows[index];
					if(!biggestTime || localObj.updatedAt > biggestTime)
						biggestTime = localObj.updatedAt;
					sql.parseObjectForClass(localObj,obj.className);
				}
				resultObjects[obj.className] = result.rows;
				//console.log("resulted query with " + result.rows.length);
				//console.log(result);
				//output: Tue Jan 15 2013 19:12:47 GMT-600 (CST)
				queue.next();//
			});
		},function(finished){
			finish(biggestTime);
		});
	};
	function finish(biggestTime){
		logger.time('finished query');
		client.end();
		resultObjects.serverTime = new Date().toISOString();
		if(biggestTime)
			resultObjects.updateTime = biggestTime.toISOString();
      	callback(resultObjects,false);
	};
	connect();
};
