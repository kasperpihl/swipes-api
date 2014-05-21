var BaseModel = require('./base_model.js');
var sql = require('../pg_sql.js');
var _ = require('underscore');

var TodoModel = BaseModel.extend({
	tableName: "todo",
	idAttribute: "localId",
	className: "ToDo",
	relations: {},
	sql: sql.todo,

	parseRawData:function ( data, userId ) {
		
		var attributeUpdates = this.getAttributeUpdateArrayFromData( data, userId );
		
		// If deleted don't iterate attributes
		
		if ( !data.deleted ) {
			for ( var attribute in data ){
				var value = data[ attribute ];

				if ( attribute == "tags" ){
        			this.handleTagRelations( value );        
      			}

				if ( !this.sql.hasColumn( attribute ) )
			        continue;

			    if ( _.isObject( value ) && value["__type"] == "Date" )
		        	value = new Date( value[ 'iso' ] );

				attributeUpdates[ attribute ] = value;
			}
		}

		this.set( attributeUpdates, { validate:true } );
	},
	handleTagRelations:function( tags ){
		this.relations.tags = new Array();
		if ( !tags || tags.length == 0 )
			return;

		for ( var index in tags ){
			var relation = tags[ index ];
			var identifier = relation.objectId;
			if ( !identifier )
			  identifier = relation.tempId;
			if ( identifier )
			  this.relations.tags.push( identifier );
		}

	},
	validate:function( attrs, options ){
		if ( !attrs.localId )
			return "couldn't identify todo";
	}
});

module.exports = TodoModel;