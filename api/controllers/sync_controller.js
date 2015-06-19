var COMMON = 			'../../common/';
var _ = 			require('underscore');
var sql = 			require(COMMON + 'database/sql_definitions.js');
var Collections = 	require(COMMON + 'collections/collections.js');
var Parse = 		require('parse').Parse;
var util =			require(COMMON + 'utilities/util.js');
var Q = require("q");

function SyncController( userId, client, logger ){
	this.userId = userId;
	this.logger = logger;
	this.client = client;
	this.didSave = false;
	this.hasMoreToSave = false;
	this.batchSize = 25;

	// Initialize the collections to handle the objects to update/insert
	this.todoCollection = new Collections.Todo();
	this.tagCollection = new Collections.Tag();
	this.collections = { "Tag" : this.tagCollection, "ToDo": this.todoCollection };
};


// ===========================================================================================================
// Main sync function - called from the request and handles the whole sync process
// ===========================================================================================================

SyncController.prototype.sync = function ( req, userId, callback ){
	var self = this;
	var body = req.body;
	
	if( body.objects && !_.isObject( body.objects ) ) 
		return callback( false, 'Objects must be object or array' );
	

	// Run the promise loop for syncing - load, find existing, save, get updates!
	this.loadCollectionsWithObjects(body.objects)
	.then( function(){ 			return self.findInformationsFromLocalIds() 			})
	.then( function(){ 			return self.insertAndSaveObjects( body.syncId ) 	})
	.then( function(){ 			return self.fetchRecentUpdates( body.lastUpdate ) 	})
	.then( function(result){ 	return self.prepareReturnObject(result) 			})
	.then(function(returnObject){
		callback(returnObject);
	})
	.fail(function(error){
		console.log(error);
		callback(false, error);
	})
	.catch(function(error){
		console.log(error);
		callback(false, error);
	});
	
};


// ===========================================================================================================
// Load objects from Sync into collections
// ===========================================================================================================

SyncController.prototype.loadCollectionsWithObjects = function(collections){
	var deferred = Q.defer();
	this.logger.time("loadCollections");
	
	if( collections && collections["Tag"])
		this.tagCollection.loadJSONObjects( collections["Tag"] );
	if( collections && collections["ToDo"])
		this.todoCollection.loadJSONObjects( collections["ToDo"]);
	
	deferred.resolve();
	return deferred.promise; 
}



// ===========================================================================================================
// Load objects from Sync into collections
// ===========================================================================================================

SyncController.prototype.findInformationsFromLocalIds = function(){
	var deferred = Q.defer(), self = this;
	this.logger.time("findInformationsFromLocalIds");
	// Concat queries from each collection to check for their id's in the database
	var queries = this.tagCollection.getQueriesForFindingExistingObjectsAndInformations( this.userId )
		.concat(this.todoCollection.getQueriesForFindingExistingObjectsAndInformations( this.userId ));

	if ( !queries || queries.length == 0 )
		deferred.resolve();
	else{

		this.client.performQueries( queries , function( results, error ){
			if ( error )
				return deferred.reject( error );

			for ( var className in results ){
				if( className == "ToDo" ) 
					self.todoCollection.updateCollectionAndDetermineUpdates(results[className]);
				if( className == "Tag" ) 
					self.tagCollection.updateCollectionAndDetermineUpdates(results[className]);
			
			}

			deferred.resolve()
		});
	}
	return deferred.promise;
}


// ===========================================================================================================
// Insert and Update objects - check for validation errors
// ===========================================================================================================

SyncController.prototype.insertAndSaveObjects = function( syncId ){
	var deferred = Q.defer(), self = this, queries = [];
	this.logger.time("insertAndSaveObjects");

	// Concat queries from each collection to prepare insertion and update queries
	this.tagCollection.getQueriesForInsertingAndSavingObjects().then(function(tagQueries){

		queries = queries.concat(tagQueries);
		return self.todoCollection.getQueriesForInsertingAndSavingObjects();

	}).then( function(todoQueries){

		// successfully batched the queries for saving
		queries = queries.concat(todoQueries);
		if ( !queries || queries.length == 0 ){
			deferred.resolve();
		}
		else{

			// Start a transaction before saving all objects
			self.client.transaction( function( error ){
				self.client.rollback();
			});
			self.client.performQueries( queries, function( result, error , i){
				self.logger.time( "finalized insertions and updates" );
				if ( error )
					return deferred.reject( error );
				
				self.client.commit(function( result, error ){
						
					if ( error )
						return deferred.reject( error);
					
					// Send silent push to other clients that an update happened
					util.sendSilentPush([ self.userId ], { syncId: syncId });
					deferred.resolve();
				
				});

			});
		}
	}).fail(function(error){
		// an error occurred when creating the queries - most likely a validation error
		deferred.reject(error);
	});

	
	return deferred.promise;
}


// ===========================================================================================================
// Fetch changed objects to return to client
// ===========================================================================================================

SyncController.prototype.fetchRecentUpdates = function(lastUpdate){
	this.logger.log("fetchRecentUpdates");
	var deferred = Q.defer(), self = this;

	// The user indicated he has more to be saved (if client has a lot of objects it'll batch them to speed up requests)
	if ( this.hasMoreToSave ){
		deferred.resolve();
		return deferred.promise;
	}


	lastUpdate = ( lastUpdate ) ? new Date( lastUpdate ) : false;
	if( lastUpdate )
			lastUpdate = new Date( lastUpdate.getTime() + 1);

	// Concat queries from each collection to get updated objects
	var queries = [this.tagCollection.queryForFindingUpdates(this.userId, lastUpdate),
		this.todoCollection.queryForFindingUpdates(this.userId, lastUpdate)];


	this.client.performQueries(queries, function(result, error){
		self.logger.time('updates found');
		if ( error ) 
			return deferred.reject( error );
		deferred.resolve(result);
	});

	return deferred.promise;
}


// ===========================================================================================================
// Prepare return object, formatting it for client and setting time w/ more
// ===========================================================================================================

SyncController.prototype.prepareReturnObject = function( result ){
	var deferred = Q.defer(), self = this, returnObject = {}, biggestTime;

	for ( var className in result ){
		for ( var index in result [ className ] ){
			var localObj = result[className][index];
			if ( !biggestTime || localObj.updatedAt > biggestTime )
				biggestTime = localObj.updatedAt;

			sql.parseObjectForClass( localObj , className );
		}
		returnObject[ className ] = result[ className ];

		if ( biggestTime ){
			returnObject.updateTime = biggestTime.toISOString();
		}
	}

	// Intercom hmac setting
	returnObject['intercom-hmac'] = util.getIntercomHmac(this.userId);
	returnObject.ok = true;
	// The current time on the server right before returing - optional if client want to check if client time and server time is aligned
	returnObject.serverTime = new Date().toISOString();


	deferred.resolve(returnObject);
	return deferred.promise;

}


module.exports = SyncController;