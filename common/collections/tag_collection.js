var COMMON = '../';
var BaseCollection = require('./base_collection.js');
var Models = require(COMMON + 'models/models.js');
var sql = require(COMMON + 'database/sql_definitions.js');

var TagCollection = BaseCollection.extend({
	model: Models.Tag,
	sql: sql.tag,

	// ===========================================================================================================
	// Query for finding latest updates
	// ===========================================================================================================	
	getQueryForFindingUpdates: function( userId, lastUpdate ){
		var model = this.sql;
		var where = model.userId.equals( userId )
								.and( model.deleted.notEqual( true ) );
		if( lastUpdate )
			where = model.userId.equals( userId )
								.and( model.updatedAt.gt( lastUpdate ) );

		var query = model.select.apply( model, sql.getReturningColumnsForTable( model ) )
								.where( where )
								.order( model.title )
								.toNamedQuery( model.className );
		return query;
	}
});

module.exports = TagCollection;