var _ = require('underscore');
var sql = require('./pg_sql.js');
var PGBatcher = require('./pg_batcher.js');
var Queue = require('../utilities/queue.js');
var PGClient = require('./pg_client.js');

function PGHandler( logger ){
	this.logger = logger;
	this.client = new PGClient();
	this.batchInserts = false;
	this.batchSize = 50;
};

PGHandler.prototype.test = function( callback ){
	var models = [ sql.todo() , sql.tag() , sql.todo_tag() ];
	var queries = [];
	for(var i in models){
		var model = models[i];
		queries.push(model['delete']().toQuery());
	}
	var self = this;
	this.client.connect( function( connected, error ){
		if( error )
			return callback( error );
		if ( connected ){
			self.client.performQueries( queries ,function(result,error){
				console.log(result);
				console.log(error);
				callback(result);
			});
		}
	});

	/*var todo = sql.todo();
	var query = todo.update()
					.where( todo.id.in( [ 1 , 2 ] ) )
					.toQuery();
	console.log(query.text);
	callback(query.text);*/
};

PGHandler.prototype.sync = function ( body, userId, callback ){

	if( body.objects && !_.isObject( body.objects ) ) 
		return callback( false, 'Objects must be object or array' );

	var self = this;
	var batcher = new PGBatcher( body.objects, userId );
	
	var resultObjects = {};

	function findIdsFromLocalIdsToDetermineUpdates(){
		
		self.logger.log( 'finding ids determing updates' );
		
		var queries = batcher.getQueriesForFindingIdsFromLocalIds( self.batchSize );
		if ( !queries )
			return insertAndSaveObjects();

		self.client.performQueries( queries , function( results, error ){

			self.logger.time('found ids determing updates');
			
			if ( error )
				return finishWithError( error );

			for ( var className in results ){
				batcher.updateCollectionToDetermineUpdatesWithResult( className , results[ className ] );
			}

			insertAndSaveObjects();
		});
	};

	function insertAndSaveObjects(){
		var queries = batcher.getQueriesForInsertingAndSavingObjects( self.batchInserts, self.batchSize );
		if ( !queries )
			return getUpdates();

		self.logger.log( "inserting and saving " + queries.length + " number of queries " );
		
		self.client.performQueries( queries, function( result, error ){
			self.logger.time( "inserted objects" );
			if ( error )
				return finishWithError( error );
			handleRelations();
		});
	};
	
	
	function handleRelations(){

		var initialRelationShipQueries = batcher.getInitialRelationshipQueries();
		if ( !initialRelationShipQueries )
			return getUpdates();

		self.client.transaction( function( error ){
			self.client.rollback();
		});
		self.logger.log("starting relationship updates");
		self.client.performQueries( initialRelationShipQueries,function( result, error ){
			// TODO: handle error
			self.logger.time("relationship step 1");
			if ( error ) 
				return finishWithError( error );

			var finalRelationshipQueries = batcher.getFinalRelationshipQueriesWithResults( result );

			self.client.performQueries( finalRelationshipQueries, function( result, error){
				// TODO: Handle error here
				self.logger.time("relationship updates done");

				if ( error )
					return finishWithError( error );

				self.client.commit(function( result, error ){
					
					if ( error )
						return finishWithError( error);
					
					getUpdates();
				
				});	
			});
		});
	};

	function getUpdates(){
		var lastUpdate = ( body.lastUpdate ) ? new Date( body.lastUpdate ) : false;
		
		var queries = batcher.getQueriesForFindingUpdates( lastUpdate );

		self.logger.log('finding updates');

		self.client.performQueries(queries, function(result, error){
			self.logger.time('updates found');
			if ( error ) 
				return finishWithError( error );

			var relations = {};
			if(result["todo_tags"] && result.todo_tags.length > 0){
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
					}
					sql.parseObjectForClass(localObj,className);
				}
				resultObjects[className] = result[className];
			}
			//console.log(result);
			finish( biggestTime );
		});
		
	};
	function finishWithError(error){
		self.client.end();
		callback( false, error );
	};
	function finish(biggestTime){
		self.logger.time('finished query');
		self.client.end();
		resultObjects.serverTime = new Date().toISOString();
		if ( biggestTime )
			resultObjects.updateTime = biggestTime.toISOString();
      	
      	callback( resultObjects , false );
	};

	// Connect client and get started
	this.client.connect( function( connected, error ){
		if( error )
			return finishWithError ( error );
		if ( connected )
			findIdsFromLocalIdsToDetermineUpdates();
	});
};

module.exports = PGHandler;