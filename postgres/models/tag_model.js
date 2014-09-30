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
				if( attribute == "title" && !value ){
					this.set("validationError", "corruptdata");
					continue;
				}
				if ( !this.sql.hasColumn( attribute ) )
			        continue;
				attributeUpdates[ attribute ] = value;
			}
		}
		this.set( attributeUpdates );
	},
	validate: function( attrs, options ){
		if ( !attrs.localId )
			return "couldn't identify tag";
		// is insertion
		if ( !attrs.databaseId ){
			if ( !attrs.title )
				return "title is missing for insertion of tag";
			if ( !attrs.userId )
				return "userId must be set for insertion of tag";
		}
	}
});

module.exports = TagModel;