var COMMON = '../../';
var sql = require(COMMON + 'database/sql_definitions.js');
var SyncController = require( './sync_controller.js' );

function AdminController( client, logger ){
	this.client = client;
	this.logger = logger;
	this.logger.forceOutput = true;
};


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