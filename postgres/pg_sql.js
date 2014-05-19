var sql = require('sql');
var _ = require('underscore');

var sharedColumns = [ "id", 'localId', "updatedAt", "deleted", "createdAt" , "userId" ];
var todoColumns = [ "title" , "notes" , "order" , "priority" , "location" ,  "repeatCount" , "schedule" , "completionDate", "repeatedDate", "repeatOption" , "tagsLastUpdate"];
var tagColumns = [ "title" ];

exports.todo = sql.define( { 
	'name' : "todo" , 
	'columns' : sharedColumns.concat( todoColumns ) 
} );

exports.tag = sql.define( { 
	'name' : "tag", 
	'columns' : sharedColumns.concat( tagColumns ) 
} );
exports.todo_tag = sql.define( { 
	'name' : "todo_tag" , 
	"columns" : [ 'id' , "todoId" , "tagId" , "userId" , "order" ] 
} );





var sharedReturnColumns = [ 'localId' , 'updatedAt' , 'deleted'];
var todoReturnColumns = [ "title", "notes", "order", "priority", "location", "repeatCount", "schedule", "completionDate", "repeatedDate", "repeatOption"];
var tagReturnColumns = [ 'title' ];




exports.todo.returnColumns = sharedReturnColumns.concat( todoReturnColumns );
exports.tag.returnColumns = sharedReturnColumns.concat( tagReturnColumns );
exports.todo.className = "ToDo";
exports.tag.className = "Tag";

exports.retColumns = function( self ){
	
	var attributeArray = [];
	for ( var key in self.returnColumns ){
		var attribute = self[ self.returnColumns[ key ] ];

		if ( self.returnColumns[ key ] == "localId" ){
			attributeArray.push( attribute.as( 'tempId' ) );
			attribute = attribute.as( "objectId" );
		}
		
		attributeArray.push( attribute );
	}

	return attributeArray;
};

function convertDate( dateObj ){
	var object = { "__type" : "Date", "iso" : dateObj.toISOString() };
	
	return object;
};

exports.parseObjectForClass = function( object, className ){

	object.parseClassName = className;
	if ( className == "ToDo" ){

		for ( var attribute in object ){
			if ( object[ attribute ] && _.indexOf( [ 'schedule' , "completionDate" , "repeatedDate" ], attribute ) != -1 )
				object[ attribute ] = convertDate( object[ attribute ] );
		}
	}
};


exports.objectForClass = function ( className ){
	if ( className == "ToDo" )
		return exports.todo;
	else if ( className == "Tag" )
		return exports.tag;
};