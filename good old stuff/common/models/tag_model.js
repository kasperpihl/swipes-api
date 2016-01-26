var BaseModel = require('./base_model.js');
var sql = require('../database/sql_definitions.js');

var TagModel = BaseModel.extend({
	tableName: "tag",
	className: "Tag",
	idAttribute: "localId",
	sql: sql.tag,

	// ===========================================================================================================
	// Load json into the model
	// ===========================================================================================================
	parseRawData: function( data, organisationId ){

		var attributeUpdates = this.getAttributeUpdateArrayFromData( data, organisationId );
		
		// Only iterate attributes if object is not deleted
		if ( !data.deleted ) {
			for ( var attribute in data ){

				var value = data[ attribute ];

				// Check If attribute exist in SQL - sql_definitions.js
				if ( !this.sql.hasColumn( attribute ) )
					continue;

				attributeUpdates[ attribute ] = value;
			}
		}
		this.set( attributeUpdates );
	},
	// ===========================================================================================================
	// Validate model for missing attributes and wrong values
	// ===========================================================================================================
	validate: function( attrs, options ){
		if ( !attrs.localId )
			return "no identifier for tag";

		// Invalid title
		if( attrs.title && attrs.title.length == 0 ){
			return "invalid title for tag";
		}

		// is insertion
		if ( !attrs.databaseId){
			if ( !attrs.title ){
				return "title is missing for insertion of tag";
			}
			if ( !attrs.userId )
				return "userId must be set for insertion of tag";
		}
	}
});

module.exports = TagModel;