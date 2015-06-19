var COMMON = '../../';
var sql = require(COMMON + 'database/sql_definitions.js');
var SyncController = require( './sync_controller.js' );

function AdminController( client, logger ){
	this.client = client;
	this.logger = logger;
	this.logger.forceOutput = true;
};

/*
app.route( '/move' ).get( function( req, res ){
	Parse.initialize( keys.get( "applicationId" ) , keys.get( "javaScriptKey" ) , keys.get( "masterKey" ) );

	var logger = new Logger();
	var client = new PGClient( logger );
	if ( !req.query.from)
		return res.jsonp({code:142,message:"from must be specified"});
	var users = { "test": "qm6FIHpYQX", "felipe": "b4mooVKc4f", "stanimir": "ONaP54dxAu", "kasper": "3TMYzCDo6u", "none": "none"};


	var to, from = req.query.from;
	if(users[from])
		from = users[from];

	if ( req.query.to && users[req.query.to] ){
		to = users[req.query.to];
	}
	else
		return res.jsonp({code:142,message:"'to' must be defined (firstName)"});

	var moveController = new MoveController( client, logger );
	moveController.copyDataFromUserToUser( from, to, function(results, error){
		//console.log(results);
		if(error){
			res.jsonp(error);
		}
		else{
			res.jsonp({"status":"success"});
		}
	});
	return ;
});
*/

AdminController.prototype.deleteAllDataForUser = function( userId, callback ){
	var todo = sql.todo;
	var tag = sql.tag;
	var todo_tag = sql.todo_tag;
	var todo_attachment = sql.todo_attachment;
	var self = this;
	var deleteTodoQuery = sql.todo['delete']().where( sql.todo.userId.equals( userId )).toQuery();
	var deleteTagQuery = sql.tag['delete']().where( sql.tag.userId.equals( userId )).toQuery();

	var queries = [ deleteTodoQuery, deleteTagQuery ];

	self.client.performQueries( queries, function(results, error){
		if(results){
			callback(results,error);
		}
		else
			callback(false,error);
	});
}


AdminController.prototype.copyDataFromUserToUser = function( fromUserId, toUserId, callback ){
	var self = this;

	var fromBatcher = new PGBatcher([], fromUserId, self.logger);
	var queries = fromBatcher.getQueriesForFindingUpdates();
	self.client.performQueries( queries, function(results, error){
		if(results){
			
			var clientFormat = fromBatcher.prepareReturnObjectsForResult(results);
			var body = {"objects": {}};

			body["objects"]["Tag"] = clientFormat["Tag"];
			body["objects"]["ToDo"] = clientFormat["ToDo"];
			//console.log(body.objects.Tag);
			//callback(true);
			//return;
			self.deleteAllDataForUser(toUserId,function(result,error){
				if(!error){
					var syncController = new SyncController( self.client, self.logger );
					syncController.sync(body, toUserId, function( result, error){
						callback("done",error);
					});
				}
				else callback(false, error);
			})
		}
		else
			callback(false,error);
	});
};

module.exports = AdminController;