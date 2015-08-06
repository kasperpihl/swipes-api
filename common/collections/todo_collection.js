var COMMON = '../';
var BaseCollection = require('./base_collection.js');
var Models = require(COMMON + 'models/models.js');
var sql = require(COMMON + 'database/sql_definitions.js');

var TodoCollection = BaseCollection.extend({
	model: Models.Todo,
	sql: sql.todo,

	// ===========================================================================================================
	// Query for finding latest updates
	// ===========================================================================================================
	queryForFindingUpdates: function( organisationId, lastUpdate ){
		var model = this.sql;
		var where = model.ownerId.equals( organisationId )
								.and( model.deleted.notEqual( true ) );
		if( lastUpdate )
			where = model.ownerId.equals( organisationId )
								.and( model.updatedAt.gt( lastUpdate ) );

		var query = model.select.apply( model, sql.getReturningColumnsForTable( model ) )
								.where( where )
								.order( model.userId, model.parentLocalId.descending )
								.toNamedQuery( model.className );
		return query;
	},

	// ===========================================================================================================
	// Query for finding tasks imported from a service
	// ===========================================================================================================
	queryToFindTodosForService: function(userId, service){
		var columnsToReturn = [ "id", "localId", "origin", "originIdentifier", "title", "updatedAt", "attachments" ];
		var query = this.sql.select.apply( this.sql, sql.getColumnsFromStringArray( this.sql, columnsToReturn) )
			.from( this.sql )
			.where( this.sql.origin.equals( service )
					.and( this.sql.userId.equals( userId ) ))
			.order( this.sql.originIdentifier )
			.toNamedQuery( "" + service + "Query" );
		return query; 
	},


	// ===========================================================================================================
	// New task created from a service
	// ===========================================================================================================
	newTaskFromService: function( service, serviceIdentifier ){
	}
});

module.exports = TodoCollection;