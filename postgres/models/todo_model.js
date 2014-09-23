var BaseModel = require('./base_model.js');
var sql = require('../pg_sql.js');
var _ = require('underscore');

var TodoModel = BaseModel.extend({
	tableName: "todo",
	idAttribute: "localId",
	className: "ToDo",
	sql: sql.todo,
	repairDateString:function(dateStr){
		var repairedString;
		if(dateStr.indexOf("T") != 10)
		return false;
		var timeStr = dateStr.substring(11);
		var repairedString = timeStr;

		// different variations of am or pm in the string
		var amArray = [' am',' a.m.', ' AM'];
		var pmArray = [' pm', ' p.m.', ' PM'];

		// var to find if am or pm is in the string
		var amOrPm = "none";

		// Convert 
		function convertTo24Hour(hours, amOrPm) {
			if(amOrPm == "am" && hours == 12) {
				hours = 0;
			}
			if(amOrPm == "pm" && hours < 12) {
				hours = (hours + 12);
			}
			var hourString = ""+ hours;
			if( hourString.length == 1)
				hourString = "0" + hourString;
			
			return hourString;
		};

		function containsStringFromArray(string, array){
			for (var i = 0; i < array.length; i++) {
				var substring = array[i];
				if (string.indexOf(substring) != - 1) {
					return substring;
				}
			}
			return null;
		};

		// locate if AM/PM
		var amString = containsStringFromArray(timeStr, amArray);
		var pmString = containsStringFromArray(timeStr, pmArray);

		// Clean AM/PM out from the string
		if(amString){
			repairedString = repairedString.replace(amString, "");
			amOrPm = "am";
		}
		else if(pmString){
			repairedString = repairedString.replace(pmString, "");
			amOrPm = "pm";
		}

		var minuteSeperatorIndex = repairedString.indexOf(':');
		if(minuteSeperatorIndex == -1){
			repairedString = repairedString.replace('.',':');
		}

		// if , occurs, replace it with a dot
		repairedString = repairedString.replace(',','.');

		// Replace hours accordingly
		if(amOrPm != "none"){
			
			var hour = parseInt(timeStr.substring(0, minuteSeperatorIndex ));

			var newHourString = convertTo24Hour(hour, amOrPm);
			repairedString = newHourString + repairedString.substring(minuteSeperatorIndex);

		}

		var newString = dateStr.substring(0,11) + repairedString;
		//console.log(dateStr.substring(0,11) + repairedString);
		console.log( "repaired " + timeStr + " to: " +newString );
		// Replace signs
		return newString;
	},
	parseRawData:function ( data, userId ) {
		this.relations = {};
		var attributeUpdates = this.getAttributeUpdateArrayFromData( data, userId );
		
		// If deleted don't iterate attributes
		if ( !data.deleted ) {
			for ( var attribute in data ){
				var value = data[ attribute ];

				if ( attribute == "tags" ){
        			this.handleTagRelations( value );        
      			}
      			if ( attribute == "attachments" ){
      				this.handleAttachmentRelations( value );
      			}
      			if( attribute == "title" && !value ){
      				this.validationError = "corruptdata";
      				continue;
      			}

				if ( !this.sql.hasColumn( attribute ) )
			        continue;

			    if ( _.isObject( value ) && value["__type"] == "Date" ){
			    	var oldVal = value;
		        	value = new Date( value[ 'iso' ] );
		        	if(_.isDate(value) && !this.isValidDate(value)){
		        		var repairedString = this.repairDateString(oldVal['iso']);
		        		value = new Date( repairedString );
		        		if(_.isDate(value) && !this.isValidDate(value)){
		        			console.log("failed repair " + oldVal['iso']);
		        		}
					}
			    }
			    if( ( attribute == "title" || attribute == "originIdentifier") && value && value.length > 255 ){
			    	value = value.substring(0,255);
      			}
      			

				attributeUpdates[ attribute ] = value;
			}
		}

		this.set( attributeUpdates );
	},
	handleAttachmentRelations:function( attachments ){
		this.relations.attachments = new Array();
		if ( !attachments || attachments.length == 0 )
			return;
		for ( var index in attachments ){
			this.relations.attachments.push( attachments[ index ] );	
		}
	},
	handleTagRelations:function( tags ){
		this.relations.tags = new Array();
		if ( !tags || tags.length == 0 )
			return;

		for ( var index in tags ){
			var relation = tags[ index ];
			if ( !relation )
				continue;
			var identifier = relation.objectId;
			if ( !identifier )
			  identifier = relation.tempId;
			if ( identifier )
			  this.relations.tags.push( identifier );
		}

	},
	isValidDate: function(d){
		if ( !_.isDate(d) )
    		return false;
  		return !isNaN(d.getTime());
	},
	validate:function( attrs, options ){
		if ( !attrs.localId )
			return "couldn't identify todo";
		
		if(attrs.schedule && !this.isValidDate(attrs.schedule)){
			console.log("validate");
			console.log(attrs.schedule);
		}

		//if(attrs.schedule)
		// is insertion

		if ( !attrs.databaseId ){
			if ( !attrs.title )
				return "title is missing for insertion of todo";
			if ( !attrs.userId )
				return "userId must be set for insertion of todo";
		}
	}
});

module.exports = TodoModel;