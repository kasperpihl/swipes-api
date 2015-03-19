var sql = require('../postgres/pg_sql.js');
var PGBatcher = require('../postgres/pg_batcher.js');
var PGHandler = require( '../postgres/pg_handler.js' );
var ParseQueries = require('../parse/parse_queries.js');
var ParseBatcher = require('../parse/parse_batcher.js');
var Queue = require('../utilities/queue.js');

function MoveController( client, logger ){
	this.client = client;
	this.logger = logger;
	this.logger.forceOutput = true;
};


MoveController.prototype.deleteAllDataForUser = function( userId, callback ){
	var todo = sql.todo;
	var tag = sql.tag;
	var todo_tag = sql.todo_tag;
	var todo_attachment = sql.todo_attachment;
	var self = this;
	var deleteTodoQuery = sql.todo['delete']().where( sql.todo.userId.equals( userId )).toQuery();
	var deleteTagQuery = sql.tag['delete']().where( sql.tag.userId.equals( userId )).toQuery();
	var deleteTagRelationQuery = sql.todo_tag['delete']().where( sql.todo_tag.userId.equals( userId )).toQuery();
	var deleteAttachmentRelationQuery = sql.todo_attachment['delete']().where( sql.todo_attachment.userId.equals( userId )).toQuery();


	var queries = [ deleteTodoQuery, deleteTagQuery, deleteTagRelationQuery, deleteAttachmentRelationQuery ];

	self.client.performQueries( queries, function(results, error){
		if(results){
			callback(results,error);
		}
		else
			callback(false,error);
	});
}


MoveController.prototype.copyDataFromUserToUser = function( fromUserId, toUserId, callback ){
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
					var toHandler = new PGHandler( self.client, self.logger );
					toHandler.sync(body, toUserId, function( result, error){
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






MoveController.prototype.loadDataFromParseFromUser = function( fromUserId, callback ){
	var queue = new Queue( 3 );
	var parseQueries = new ParseQueries( fromUserId );
	var parseBatcher = new ParseBatcher();
	var queries = parseQueries.queriesForUpdating( );
	var self = this;

    parseQueries.runQueriesToTheEnd( queries , function( result , error , query ){
    	//console.log( result.length);
        if ( error ) 
            return callback( false, error);
        console.log(result);
        for ( var parseClassName in result ){
        	for ( var index in result[ parseClassName ] ){
        		var obj = result[ parseClassName ][ index ];
        		parseBatcher.scrapeChanges( obj );
        		result[ parseClassName ][ index ] = obj.toJSON();
        	}
        }
        callback( result, false);
    });
};

MoveController.prototype.copyDataFromParseToPostgresForUser = function( userId , callback ){
	//var fromBatcher = new PGBatcher( false, fromUserId, this.logger );
	//var queries =  fromBatcher.getQueriesForFindingUpdates();
	var self = this;

	this.loadDataFromParseFromUser( userId, function( result, error ){
		if ( error )
			return callback( error );
		var toBatcher = new PGBatcher( result, userId, self.logger );
		self.client.transaction(function( error){
			self.client.rollback();
		});
		var queries = toBatcher.getQueriesForInsertingAndSavingObjects( 50 );
		self.client.performQueries( queries , function( result, error){
			if ( error )
				return callback(error);
			
			self.client.commit();
			self.client.end();
			callback( result );
		
		});
	});
};

module.exports = MoveController;