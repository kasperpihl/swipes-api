var BaseModel = require('./base_model.js');
var sql = require('../pg_sql.js');

var TodoModel = BaseModel.extend({
	tableName: "todo",
	idAttribute: "localId",
	className: "ToDo",
	sql: sql.todo,

	initialize:function(){
	},
	parseRawData:function ( data, userId ) {
		
		var attributeUpdates = this.getAttributeUpdateArrayFromData( data, userId );
		
		// If deleted don't iterate attributes
		
		if ( !data.deleted ) {
			for ( var attribute in data ){
				var value = data[ attribute ];

				if ( attribute == "tags" ){
        			this.handleTagRelationsForObjectWithId( customUpdateObject.localId , result );        
      			}

				if ( !this.sql.hasColumn( attribute ) )
			        continue;

			    if ( _.isObject( result ) && result["__type"] == "Date" )
		        	result = new Date( result[ 'iso' ] );

				attributeUpdates[ attribute ] = value;
			}
		}

		this.set( attributeUpdates, { validate:true } );
	},
	validate:function( attrs, options ){
		if ( !attrs.localId )
			return "couldn't identify todo";
	}
});

module.exports = TodoModel;