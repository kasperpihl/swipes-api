var _ = require('underscore');
var sql = require('./pg_sql.js');
var PGBatcher = require('./pg_batcher.js');
var Queue = require('./queue.js');
var PGClient = require('./pg_client.js');


function Postgres( logger ){
	this.logger = logger;
	this.client = new PGClient();
};



Postgres.prototype.sync = function ( body, userId, callback ){

	if ( !userId )
		return callback( false, 'You have to be logged in' );
	if( body.objects && !_.isObject( body.objects ) ) 
		return callback( false, 'Objects must be object or array' );

	var self = this;
	var batcher = new PGBatcher( body.objects, userId );
	
	var resultObjects = {};

	function findIdsFromLocalIdsToDetermineUpdates(){
		var queries = batcher.getQueriesForFindingIdsFromLocalIds();
		if (!queries)
			return insertAndSaveObjects();

		self.client.performQueries( queries , function( results, error ){
			// TODO: Handle error
			if ( error )
				console.log(error);

			for ( var className in results ){
				batcher.updateCollectionToDetermineUpdatesWithResult( className , results[ className ] );
			}

			insertAndSaveObjects();
		});
	};

	function insertAndSaveObjects(){
		var queries = batcher.getQueriesForInsertingAndSavingObjects();
		if ( !queries )
			return getUpdates();

		self.client.performQueries( queries, function( result, error ){
			// TODO: handle error here
			if ( error )
				console.log( error );
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

		self.client.performQueries( initialRelationShipQueries,function( result, error ){
			// TODO: handle error
			if ( error ) 
				console.log("t" + error);

			var finalRelationshipQueries = batcher.getFinalRelationshipQueriesWithResults( result );

			self.client.performQueries( finalRelationshipQueries, function( result, error){
				// TODO: Handle error here
				if ( error )
					console.log(error);

				self.client.commit(function(error){

					getUpdates();	
				});	
			});
		});
	};

	function getUpdates(){
		var lastUpdate = ( body.lastUpdate ) ? new Date( body.lastUpdate ) : false;
		
		var queries = batcher.getQueriesForFindingUpdates( lastUpdate );

		self.client.performQueries(queries, function(result, error){
			// TODO: handle error here
			if(error) 
				console.log(error);
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
		if ( connected )
			findIdsFromLocalIdsToDetermineUpdates();
	});
};

module.exports = Postgres;