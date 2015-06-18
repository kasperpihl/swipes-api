var COMMON = 			'../../common/';
var _ = 			require('underscore');
var sql = 			require(COMMON + 'database/sql_definitions.js');
var Collections = 	require(COMMON + 'collections/collections.js');
var Parse = 		require('parse').Parse;

function SyncController( client, logger ){
	this.logger = logger;
	//this.logger.forceOutput = true;
	this.client = client;
	this.didSave = false;
	this.hasMoreToSave = false;
	this.batchSize = 25;
};
SyncController.prototype.loadCollections = function(collections){
	this.todoCollection = new Collections.Todo();
	this.tagCollection = new Collections.Tag();
	this.collections = { "Tag" : this.tagCollection, "ToDo": this.todoCollection };
}

SyncController.prototype.sync = function ( req, userId, callback ){
	
	var body = req.body;
	
	if( body.objects && !_.isObject( body.objects ) ) 
		return callback( false, 'Objects must be object or array' );
	
	var self = this;
	
	if( body.syncId )
		self.syncId = body.syncId;

	function finishWithError(error){
		callback( false, error );
	};

	
	var batcher = new PGBatcher( body.objects, userId, this.logger );
	if ( batcher.error )
		return finishWithError( batcher.error );

	this.logger.time('batched objects');

	function findInformationsFromLocalIds(){
		
		var queries = batcher.getQueriesForFindingIdsFromLocalIds( self.batchSize );
		if ( !queries )
			return insertAndSaveObjects();
		self.client.performQueries( queries , function( results, error ){
			if ( error )
				return finishWithError( error );

			for ( var className in results ){

				batcher.updateCollectionToDetermineUpdatesWithResult( className , results[ className ] );
			}

			insertAndSaveObjects();
		});
	};


	function insertAndSaveObjects(){
		var queries = batcher.getQueriesForInsertingAndSavingObjects( self.batchSize );
		if( batcher.error ){
			return finishWithError(batcher.error);
		}

		if ( !queries )
			return getUpdates();
		self.didSave = true;
		self.logger.time( "inserting and saving " + queries.length + " number of queries " );
		
		self.client.transaction( function( error ){
			self.client.rollback();
		});
		self.client.performQueries( queries, function( result, error , i){
			self.logger.time( "finalized insertions and updates" );
			if ( error )
				return finishWithError( error );
			
			self.client.commit(function( result, error ){
					
				if ( error )
					return finishWithError( error);
				
				getUpdates();
			
			});

		});
	};
	
	function getUpdates(){
		if ( self.hasMoreToSave )
			return finish();
		var lastUpdate = ( body.lastUpdate ) ? new Date( body.lastUpdate ) : false;
		if(self.didSave){
			sendPush();
		}
		if( lastUpdate )
			lastUpdate = new Date( lastUpdate.getTime() + 1);
		//lastUpdate = false;
		self.logger.time("making queries for updates");
		var queries = batcher.getQueriesForFindingUpdates( lastUpdate );

		self.logger.time('made queries for updates');

		self.client.performQueries(queries, function(result, error){
			self.logger.time('updates found');
			if ( error ) 
				return finishWithError( error );

			var resultObjects = batcher.prepareReturnObjectsForResult( result, lastUpdate );
			finish( resultObjects );
		});
		
	};
	function sendPush(){
		var data = {
			channels:[ userId ], //"wjDRVyp6Ot"
			data:{
				aps:{
					"content-available": 1,
					"sound": ""
				}
			}
		};
		if(self.syncId)
			data.data.syncId = self.syncId

		Parse.Push.send(data, {
			success:function(){
			},
			error: function(error){
			}
		});
	}
	function finish( resultObjects ){
		self.logger.time('finished query');
		self.client.end();
		if( !resultObjects )
			resultObjects = {};
		resultObjects['intercom-hmac'] = util.getIntercomHmac(this.userId);
		resultObjects.serverTime = new Date().toISOString();
      	callback( resultObjects , false );
	};

	// Get started
	findInformationsFromLocalIds();
};

module.exports = SyncController;