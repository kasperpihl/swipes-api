var COMMON = '../';
var Backbone = require('backbone');
var BatchUpdateQueryCreator = require(COMMON + 'database/batch_update_query_creator.js');
var Q = require("q");
var BaseCollection = Backbone.Collection.extend({
	model:false,
	batchSize: 25,


	// ===========================================================================================================
	// Loading JSON Objects, and make initial validation
	// (Obs we don't know here yet if object is to be inserted or updated)
	// ===========================================================================================================
	loadJSONObjects: function( objects, userId ){
		var models = [];
		this.errorModels = new Array();
		for ( var i in objects ){
			var data = objects[ i ];
			if(data === null || !data)
				continue;
			var model = new this.model();
			
			model.parseRawData( data, userId );
			if( !model.get("validationError") )
				models.push(model);
			else{
				this.error = model.get("validationError");
				this.errorModels.push(model);
			}
		}
		this.add(models);
		this.on('invalid', function(model, error){

		})
	},


	// ===========================================================================================================
	// Generating queries for finding and determining which of the objects already exists
	// attributes 
	// ===========================================================================================================
	getQueriesForFindingExistingObjectsAndInformations: function(userId, attributes){

		var table = this.sql, queries = [];
		var localIds = this.pluck("localId");

		if ( !localIds || localIds.length == 0 )
			return queries;

		var chunks = [];
		while ( localIds.length > 0 )
			chunks.push( localIds.splice( 0, this.batchSize ) );

		for( var index in chunks ){
			var chunk = chunks[ index ];
			var query = table.select.apply( table, [ table.id, table.localId ] )
							.from( table )
							.where( table.userId.equals( userId ).and( table.localId.in( chunk ) ) )
							.toNamedQuery( table.className );
			query.numberOfRows = chunk.length;
			queries.push(query);
		}
		return queries;
	},

		// Update models with databaseId determining which is updates (results is the result of queries from above)
		// ===========================================================================================================
	updateCollectionAndDetermineUpdates: function( results ){
		for( var i in results ){
			var row = results[ i ];
			console.log(row);
			var model = this.get( row.localId );
			if ( model ){
				model.set( { "databaseId" : row.id } );
			}
		}
	},



	// ===========================================================================================================
	// Generate queries for inserting and saving the collection objects
	// ===========================================================================================================
	getQueriesForInsertingAndSavingObjects: function(){
		var returnQueries = [], self = this, deferred = Q.defer();
		

		// Group between insertions and updates
		var collection = this.groupBy(function( model){
			// check for validations
			model.set({}, { validate:true });
			if ( model.validationError ){
				if(model.get("deleted"))
					return "ignore";
				self.error = { code: 157, message: model.validationError, hardSync: true };
				return 'invalid';
			}
			return ( model.get('databaseId') ? 'update' : 'insert' ) 
		});
		// Reject promise if errors
		if ( self.error ){
			console.log(self.error);
			deferred.reject(self.error);
			return deferred.promise;
		}
		console.log(collection);


		var updates = collection['update'];
		var insertions = collection['insert'];

		var model = this.sql;
		// Local function to add query to return array.
		function pushQuery( query, numberOfRows ){
			query = query.toQuery();

			if( numberOfRows )
				query.numberOfRows = numberOfRows;

			returnQueries.push( query );

		};


		// Start insertions, iterate and call toJSON for models, when hit batchSize, start new query chain
		if( insertions && insertions.length > 0 ){
			var query = model;
			var batchCounter = 0;
			for ( var i in insertions ){
				var obj = insertions[ i ];
				query = query.insert( obj.toJSON() );

				if ( ++batchCounter >= self.batchSize ){

					pushQuery( query, batchCounter );
					batchCounter = 0;
					query = model; 
				}

			}
			if ( batchCounter > 0){
				pushQuery( query, batchCounter );
			}
		}


		// Start updates, iterate and use a batch query creator to batch more updates into one query
		if(updates && updates.length > 0){
			query = new BatchUpdateQueryCreator( model._name, "id" , { "updatedAt" : "now()" } );
			for ( var i in updates ){
				var obj = updates[ i ];
				query.addObjectUpdate( obj.toJSON() , obj.get('databaseId') );

				if( query.objectCounter == self.batchSize ){
					pushQuery( query );
					query = new BatchUpdateQueryCreator( model._name, "id", { "updatedAt" : "now()" } );
				}
			}
			
			if( query.objectCounter > 0)
				pushQuery( query );
		}
		console.log(returnQueries);

		deferred.resolve(returnQueries);
		return deferred.promise;

	}
});

module.exports = BaseCollection;