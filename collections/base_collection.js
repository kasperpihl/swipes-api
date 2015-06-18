var Backbone = require('backbone');
var BatchUpdateQueryCreator = require('../database/batch_update_query_creator.js');

var BaseCollection = Backbone.Collection.extend({
	model:false,
	batchSize: 25,
	loadObjects: function( objects, userId ){
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
				this.errorModels.push(model);
			}
		}
		this.add(models);
		this.on('invalid', function(model, error){

		})
	},

	// Generate queries for inserting and saving the collection objects
	getQueriesForInsertingAndSavingObjects: function(){
		var returnQueries = [];
		var updateQueries = [];
		var self = this;

		// Group between insertions and updates
		var collection = this.groupBy(function( model){ 
			return ( model.get('databaseId') ? 'update' : 'insert' ) 
		});

		var updates = collection['update'];
		var insertions = collection['insert'];

		var model = this.model.sql;

		// Local function to add query to return array.
		function pushQuery( query, numberOfRows ){
			query = query.toQuery();

			if( numberOfRows )
				query.numberOfRows = numberOfRows;

			returnQueries.push( query );

		};


		// Start insertions, iterate and call toJSON for models, when hit batchSize, start new query chain
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

		return ( returnQueries.length > 0 ) ? returnQueries : false;


	}
});

module.exports = BaseCollection;