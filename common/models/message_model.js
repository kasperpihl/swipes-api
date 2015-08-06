var BaseModel = require('./base_model.js');
var sql = require('../database/sql_definitions.js');
var util = require('../utilities/util.js');
var _ = require('underscore');

var MessageModel = BaseModel.extend({
	tableName: "message",
	className: "Message",
	idAttribute: "localId",
	sql: sql.message,

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
				if ( _.isObject( value ) && value["__type"] == "Date" ){
					var tempVal = new Date( value[ 'iso' ] );
					// attempt to fix date string / old issue with clients not sending iso format - should be fixed from clients
					if(_.isDate(tempVal) && !util.isValidDate(tempVal)){
						var repairedString = util.repairDateString(value['iso']);
						tempVal = new Date( repairedString );
					}
					value = tempVal;
				}
				// Convert to jsonb for saving
				if ( attribute == "likes" ){
					// TODO: validate content of attachment/tags
					value = JSON.stringify(value);
				}

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

module.exports = MessageModel;