var BaseModel = require('./base_model.js');
var sql = require('../database/sql_definitions.js');
var util = require('../utilities/util.js');
var _ = require('underscore');

var TodoModel = BaseModel.extend({
	tableName: "todo",
	idAttribute: "localId",
	className: "ToDo",
	sql: sql.todo,


	// ===========================================================================================================
	// Load json into the model
	// ===========================================================================================================
	parseRawData:function ( data, userId ) {
		this.relations = {};
		var attributeUpdates = this.getAttributeUpdateArrayFromData( data, userId );

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
				if ( attribute == "attachments" || attribute == "tags" ){
					// TODO: validate content of attachment/tags
					value = JSON.stringify(value);
				}

				if( ( attribute == "title" || attribute == "originIdentifier") && value && value.length > 255 ){
					value = value.substring(0,255);
				}


				attributeUpdates[ attribute ] = value;
			}
		}
		this.set( attributeUpdates );
	},


	// ===========================================================================================================
	// Validate model for missing attributes and wrong values
	// ===========================================================================================================
	validate:function( attrs, options ){
		// No identifier
		if ( !attrs.localId )
			return "no identifier for todo";
		
		// Invalid title
		if( attrs.title && attrs.title.length == 0 ){
			return "invalid title";
		}

		// Invalid dates
		if(attrs.schedule &&  !util.isValidDate(attrs.schedule)){
			return "invalid schedule";
		}
		if(attrs.completionDate && !util.isValidDate(attrs.completionDate)){
			return "invalid completionDate";
		}
		if(attrs.repeatDate && !util.isValidDate(attrs.repeatDate)){
			return "invalid repeatDate";
		}

		// Object didn't exist - check for required attributes
		if ( !attrs.databaseId ){
			if ( !attrs.title ){
				return "title is missing for insertion of todo";
			}
			if ( !attrs.userId )
				return "userId must be set for insertion of todo";
		}
	}
});

module.exports = TodoModel;