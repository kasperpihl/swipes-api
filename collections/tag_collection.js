var BaseCollection = require('./base_collection.js');
var Models = require('../models/models.js');
var sql = require('../database/sql_definitions.js');

var TagCollection = BaseCollection.extend({
	model: Models.Tag,
	getQueryForFindingUpdate: function( userId, lastUpdate ){
		var model = this.model.sql;
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