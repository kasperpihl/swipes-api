var sql = require('../database/sql_definitions.js');
var ParseQueries = require('../parse/parse_queries.js');
var Parse = require('parse').Parse;

function FetchController( client, logger ){
	this.client = client;
	this.logger = logger;
};
FetchController.prototype.fetchEmailsForIds = function( ids, callback ){
	var chunkSize = 500;
	if(!ids)
		return callback(false, "must include id");
	var queries = [];
	
	var i, j;
	if ( ids.length > 0 ){
		for (  i = 0, j = ids.length;    i < j;   i += chunkSize  ) {
			var slice = ids.slice( i , i + chunkSize );
			var query = new Parse.Query(Parse.User);
			console.log(slice.length);
			query.limit(chunkSize+1);
			query.containedIn("objectId",slice);
			queries.push(query);
		}
		var parseQueries = new ParseQueries( );
		parseQueries.runQueriesToTheEnd( queries, function( result, error, query ){
			console.log(result);
			if ( error ){
	        	console.log( error );
	            return callback( false, error);
	        }
	        var emailString = "";
	        for( var i in result._User ){
	        	var user = result._User[i];
	        	var email = user.get("username");
	        	if(email && email !== undefined)
	        		emailString += email + ",";
	        }
	        callback( emailString, false);
		});
	}
	else callback(false, "no ids provided");

}
FetchController.prototype.fetchSignups = function( callback ){
	var parseQueries = new ParseQueries( );
	var query = new Parse.Query('Signup');
	query.limit(1000);
	query.descending('createdAt');
	var queries = [ query ];
	parseQueries.runQueriesToTheEnd( queries, function( result, error, query ){
		if ( error ){
	        	console.log( error );
	            return callback( false, error);
	        }
	        var emailString = "";
	        for( var i in result.Signup ){
	        	var user = result.Signup[i];
	        	var email = user.get("email");
	        	console.log(user.createdAt);
	        	if(email && email !== undefined)
	        		emailString += email + ", ";
	        	
	        	if(i == 965)
	        		break;
	        }
	        console.log(emailString);
	        console.log( result.Signup.length );
	        callback( result, false);
	});
}

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
	        callback( result, false);
	    });
		//console.log( userArray );
		//callback( result, error );
	});
};

module.exports = FetchController;