var COMMON = '../';
var sql = require('sql');
var _ = require('underscore');
var util = require(COMMON + 'utilities/util.js');

var sharedColumns = [ "id", 'localId', "updatedAt", "deleted", "userId", "createdAt" ];
var sharedReturnColumns = [ 'localId' , 'updatedAt', 'createdAt' , 'deleted' ];

var todoColumns = [ "title" , "notes" , "order" , "priority" , "location" ,  "repeatCount" , "schedule" , "completionDate", "repeatDate", "repeatOption" , "tags", "attachments" , "parentLocalId", "origin", "originIdentifier" ];
var tagColumns = [ "title" ];


exports.organisation = sql.define( {
	'name': 'organisation',
	'columns': [ 'id', 'name', 'createdAt', 'updatedAt' ]
});
exports.member = sql.define({
	'name': 'member',
	'columns': [ 'organisationId', 'userId', 'username', 'fullName']
});
exports.project = sql.define({
	'name': 'project',
	'columns': [ 'id', 'title', 'localId', 'createdAt', 'updatedAt' ]
});
exports.message = sql.define({
	'name': 'message',
	'columns': [ 'id', 'message', 'createdByUserId', 'toUserId']
})

exports.todo = sql.define( { 
	'name' : "todo" , 
	'columns' : sharedColumns.concat( todoColumns ) 
} );

exports.tag = sql.define( { 
	'name' : "tag", 
	'columns' : sharedColumns.concat( tagColumns ) 
} );
exports.session = sql.define({
	'name': "session",
	'columns': [ 'sessionToken', 'userId', 'expires' ]
} );



exports.todo.returnColumns = sharedReturnColumns.concat( todoColumns );
exports.tag.returnColumns = sharedReturnColumns.concat( tagColumns );
exports.todo.className = "ToDo";
exports.tag.className = "Tag";

exports.getColumnsFromStringArray = function( model, columnsArray ){
	var attributeArray = [];
	for ( var index in columnsArray ){
		var columnAsString = columnsArray[index];
		var column = model[ columnAsString ];
		attributeArray.push(column);
	}
	return attributeArray;
};
exports.getReturningColumnsForTable = function( table ){
	
	var attributeArray = [];
	for ( var key in table.returnColumns ){
		var attribute = table[ table.returnColumns[ key ] ];

		if ( table.returnColumns[ key ] == "localId" ){
			attributeArray.push( attribute.as( 'tempId' ) );
			attribute = attribute.as( "objectId" );
		}
		
		attributeArray.push( attribute );
	}

	return attributeArray;
};

exports.parseObjectForClass = function( object, className ){

	object.parseClassName = className;
	if ( className == "ToDo" ){
		for ( var attribute in object ){
			var value = object[ attribute ];
			if ( value && _.indexOf( [ 'schedule' , "completionDate" , "repeatDate" ], attribute ) != -1 )
				object[ attribute ] = util.convertDate( value );
		}
	}
};


exports.objectForClass = function ( className ){
	if ( className == "ToDo" )
		return exports.todo;
	else if ( className == "Tag" )
		return exports.tag;
};