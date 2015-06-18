var COMMON = '../../';
var keys = 				require(COMMON + 'utilities/keys.js');
var util = 				require(COMMON + 'utilities/util.js');
var Logger =			require(COMMON + 'utilities/logger.js' );
var Parse = 			require('parse').Parse;
var PGClient =        	require(COMMON + 'database/pg_client.js');

var SyncController = require( './sync_controller.js' );

// ===========================================================================================================
// Instantiation
// ===========================================================================================================
function APIController(req, res){
	this.req = req;
	this.res = res;
	Parse.initialize( keys.get( "applicationId" ) , keys.get( "javaScriptKey" ) , keys.get( "masterKey" ) );
	this.logger = new Logger();
	this.client = new PGClient( logger, 12000 );

};


// ===========================================================================================================
// Authorization and Request Validation
// ===========================================================================================================
APIController.prototype.validateRequest = function(){
	return true;
}
APIController.prototype.authorize = function(callback){
	var self = this;
	this.client.validateToken( this.req.body.sessionToken , function( userId, error){
		// TODO: send proper error back that fits clients handling
		if ( error )
			return self.handleError( error );
		self.logger.setIdentifier( userId ); // Set userId in the logger to identify
		callback(userId);
	});
}


// ===========================================================================================================
// Result handling
// ===========================================================================================================
APIController.prototype.handleResult = function(result, error){
	if(this.client.timedout)
		return this.handleError( {code:510, message:"Request Timed Out"} );
	if( error )
		return this.handleError(error);
	this.handleSuccess(result);
}
APIController.prototype.handleError = function(error, log){
	this.client.end();
	util.sendBackError(error, this.res);
}
APIController.prototype.handleSuccess = function(result){
	this.client.end();
	res.send( result );
}



// ===========================================================================================================
// API Calls
// ===========================================================================================================
APIController.prototype.sync = function (){
	var self = this;
	this.authorize( function(userId){
		// Successfully authed
		var syncController = new SyncController( self.client , self.logger );
		syncController.sync( self.req, userId, self.handleResult );
	});
};



module.exports = APIController;