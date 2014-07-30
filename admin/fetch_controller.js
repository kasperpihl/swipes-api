var sql = require('../postgres/pg_sql.js');
var ParseQueries = require('../parse/parse_queries.js');
var Parse = require('parse').Parse;

function FetchController( client, logger ){
	this.client = client;
	this.logger = logger;
};

FetchController.prototype.fetchList = function( callback ){
	var todo = sql.todo;
	var todo_attachment = sql.todo_attachment;
	var query = todo.select( todo.userId.distinct() ).where( todo.origin.equals( "evernote" ));
	this.client.performQuery( query.toQuery(), function( result, error){
		//console.log(result);
		var userArray = [];
		for( var i in result.rows ){
			var userId = result.rows[ i ].userId;
			userArray.push( userId );

		}
		var parseQueries = new ParseQueries( );
		var query = new Parse.Query(Parse.User);
		query.containedIn("objectId", userArray );
		var queries = [ query ];
		parseQueries.runQueriesToTheEnd( queries , function( result , error , query ){
	    	//console.log( result.length);
	        if ( error ){
	        	console.log( error );
	            return callback( false, error);
	        }
	        var emailString = "";
	        for( var i in result._User ){
	        	var user = result._User[i];
	        	var username = user.get("username");
	        	if(username && username !== undefined)
	        		emailString += user.get("username") + ", ";
	        	
	        	
	        }
	        console.log(emailString);
	        /*
	        for ( var parseClassName in result ){
	        	for ( var index in result[ parseClassName ] ){
	        		var obj = result[ parseClassName ][ index ];
	        		parseBatcher.scrapeChanges( obj );
	        		result[ parseClassName ][ index ] = obj.toJSON();
	        	}
	        }*/
	        callback( result, false);
	    });
		//console.log( userArray );
		//callback( result, error );
	});
};

module.exports = FetchController;