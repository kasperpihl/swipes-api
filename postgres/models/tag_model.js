var BaseModel = require('./base_model.js');
var sql = require('../pg_sql.js');

var TagModel = BaseModel.extend({
	tableName: "tag",
	className: "Tag",
	idAttribute: "localId",
	sql: sql.tag,

	parseRawData: function( data, userId ){

		var attributeUpdates = this.getAttributeUpdateArrayFromData( data, userId );
		
		// If deleted don't iterate attributes
		
		if ( !data.deleted ) {
			for ( var attribute in data ){
				var value = data[ attribute ];
				attributeUpdates[ attribute ] = value;
			}
		}
		this.set( attributeUpdates, { validate: true } );
	}
});

module.exports = TagModel;