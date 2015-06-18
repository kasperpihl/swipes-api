var BaseCollection = require('./base_collection.js');
var Models = require(COMMON + 'models/models.js');
var sql = require(COMMON + 'database/sql_definitions.js');

var TodoCollection = BaseCollection.extend({
	model: Models.Todo,
	getQueryForFindingUpdate: function( userId, lastUpdate ){
		var model = this.model.sql;
		var where = model.userId.equals( userId )
								.and( model.deleted.notEqual( true ) );
		if( lastUpdate )
			where = model.userId.equals( userId )
								.and( model.updatedAt.gt( lastUpdate ) );

		var query = model.select.apply( model, sql.getReturningColumnsForTable( model ) )
								.where( where )
								.order( model.userId, model.parentLocalId.descending )
								.toNamedQuery( model.className );
		return query;
	}
});

module.exports = TodoCollection;