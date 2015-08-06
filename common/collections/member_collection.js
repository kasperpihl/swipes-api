var COMMON = '../';
var BaseCollection = require('./base_collection.js');
var Models = require(COMMON + 'models/models.js');
var sql = require(COMMON + 'database/sql_definitions.js');

var MemberCollection = BaseCollection.extend({
	model: Models.Member,
	sql: sql.member,

	// ===========================================================================================================
	// Query for finding latest updates
	// ===========================================================================================================	
	queryForFindingUpdates: function( organisationId, lastUpdate ){
		var model = this.sql;
		var where = model.organisationId.equals( organisationId );
		if( lastUpdate )
			where = model.organisationId.equals( organisationId )
								.and( model.updatedAt.gt( lastUpdate ) );

		var query = model.select.apply( model, sql.getReturningColumnsForTable( model ) )
								.where( where )
								.toNamedQuery( model.className );
		return query;
	}
});

module.exports = MemberCollection;