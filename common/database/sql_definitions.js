var COMMON = '../';
var sql = require('sql');
var _ = require('underscore');
var util = require(COMMON + 'utilities/util.js');

var sharedColumns = [ "id", 'localId', "updatedAt", "deleted", "userId", "createdAt", "ownerId" ];
var sharedReturnColumns = [ 'localId' , 'updatedAt', 'createdAt' , 'deleted', "ownerId", "userId" ];

var todoColumns = [ "title" , 
					"notes" , 
					"order" , 
					"priority" , 
					"location" ,  
					"repeatCount" , 
					"schedule" , 
					"completionDate", 
					"repeatDate", 
					"repeatOption" , 
					"tags", 
					"attachments" , 
					"parentLocalId", 
					"projectLocalId", 
					"projectOrder", 
					"origin", 
					"originIdentifier",
					"toUserId",
					"assignees"
				];
var tagColumns = [ "title" ];
var projectColumns = [ 'name' ];

var memberColumns = [	'username', 
						"fullName", 
						"organisationId",
						"profileImageURL"
];

var messageColumns = [ 	'message', 
						'timestamp', 
						'toUserId',
						"projectLocalId",
						"likes" 
];

exports.organisation = sql.define( {
	'name': 'organisation',
	'columns': [ 'id', 'name', 'createdAt', 'updatedAt' ]
});
exports.member = sql.define({
	'name': 'member',
	'columns': sharedColumns.concat( memberColumns )
});

exports.message = sql.define({
	'name': 'message',
	'columns': sharedColumns.concat( messageColumns )
})

exports.project = sql.define({
	'name': 'project',
	'columns': sharedColumns.concat( projectColumns ) 
});

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
	'columns': [ 'sessionToken', 'userId', 'expires', 'organisationId' ]
} );



exports.todo.returnColumns = sharedReturnColumns.concat( todoColumns );
exports.tag.returnColumns = sharedReturnColumns.concat( tagColumns );
exports.member.returnColumns = sharedReturnColumns.concat( memberColumns );
exports.project.returnColumns = sharedReturnColumns.concat( projectColumns );
exports.message.returnColumns = sharedReturnColumns.concat( messageColumns );
exports.todo.className = "ToDo";
exports.tag.className = "Tag";
exports.member.className = "Member";
exports.project.className = "Project";
exports.message.className = "Message";


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
	if(!table.returnColumns)
		return table.star();
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