var COMMON = 			'../../common/';
var util = 				require(COMMON + 'utilities/util.js');
var Logger =			require(COMMON + 'utilities/logger.js' );
var PGClient =        	require(COMMON + 'database/pg_client.js');
var sql = 			require(COMMON + 'database/sql_definitions.js');
var Q = 				require("q");

function MoveController( req, res ){
	this.req = req;
	this.res = res;
	this.logger = new Logger();
	this.logger.forceOutput = true;
	this.client = new PGClient( this.logger, 12000 );
}


MoveController.prototype.move = function(){
/*
	fetch todo_attachments ordered by todoId limit 1000
	loop through and create 
	batch_query_creator with json for
	transaction 
*/
}