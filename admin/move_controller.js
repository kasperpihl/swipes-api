var sql = require('../postgres/pg_sql.js');
var PGBatcher = require('../postgres/pg_batcher.js');
var ParseQueries = require('../parse/parse_queries.js');
var ParseBatcher = require('../parse/parse_batcher.js');
var Queue = require('../utilities/queue.js');

function MoveController( client, logger ){
	this.client = client;
	this.logger = logger;
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