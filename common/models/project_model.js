var BaseModel = require('./base_model.js');
var sql = require('../database/sql_definitions.js');

var ProjectModel = BaseModel.extend({
	tableName: "project",
	className: "Project",
	idAttribute: "localId",
	sql: sql.project,

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
		
	}
});

module.exports = ProjectModel;