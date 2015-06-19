// ===========================================================================================================
// Work Controller - Handling Work Requests for the Background Worker
// ===========================================================================================================


var COMMON = 			'../../common/';
var util = 				require(COMMON + 'utilities/util.js');
var Logger =			require(COMMON + 'utilities/logger.js' );
var Parse = 			require('parse').Parse;
var PGClient =        	require(COMMON + 'database/pg_client.js');
var Q = 				require("q");



// ===========================================================================================================
// Instantiation
// ===========================================================================================================
function WorkController(req, res){
	this.req = req;
	this.res = res;
	Parse.initialize( util.getOption( "applicationId" ) , util.getOption( "javaScriptKey" ) , util.getOption( "masterKey" ) );
	this.logger = new Logger();
	this.logger.forceOutput = true;
	this.client = new PGClient( this.logger, 12000 );

};


module.exports = WorkController;