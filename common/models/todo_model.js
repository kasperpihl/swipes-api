var BaseModel = require('./base_model.js');
var sql = require('../database/sql_definitions.js');
var util = require('../utilities/util.js')();
var _ = require('underscore');

var TodoModel = BaseModel.extend({
	tableName: "todo",
	idAttribute: "localId",
	className: "ToDo",
	sql: sql.todo,

	parseRawData:function ( data, userId ) {
		this.relations = {};
		var attributeUpdates = this.getAttributeUpdateArrayFromData( data, userId );
		
		// If deleted don't check attributes attributes
		if ( !data.deleted ) {
			for ( var attribute in data ){
				var value = data[ attribute ];

      			if( attribute == "title" && !value ){
      				this.set("validationError", "corruptdata");
      				continue;
      			}

				if ( !this.sql.hasColumn( attribute ) )
			        continue;

			    if ( _.isObject( value ) && value["__type"] == "Date" ){
			    	//var oldVal = value;
		        	var tempVal = new Date( value[ 'iso' ] );
		        	if(_.isDate(tempVal) && !this.isValidDate(tempVal)){
		        		var repairedString = util.repairDateString(value['iso']);
		        		tempVal = new Date( repairedString );
		        		if(_.isDate(tempVal) && !this.isValidDate(tempVal)){
		        			this.set("validationError", "failed repair " + value['iso']);
		        			continue;
		        		}
		        		
					}
					value = tempVal;
			    }

			    if ( attribute == "attachments" || attribute == "tags" ){
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
	isValidDate: function(d){
		if ( !_.isDate(d) )
    		return false;
  		return !isNaN(d.getTime());
	},
	validate:function( attrs, options ){
		if ( !attrs.localId )
			return "couldn't identify todo";
		
		if(attrs.schedule &&  !this.isValidDate(attrs.schedule)){
			return "invalid schedule";
		}

		if(attrs.completionDate && !this.isValidDate(attrs.completionDate)){
			return "invalid completionDate";
		}

		if(attrs.repeatDate && !this.isValidDate(attrs.repeatDate)){
			return "invalid repeatDate";
		}		//if(attrs.schedule)
		// is insertion

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