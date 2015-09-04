// ===========================================================================================================
// API Controller - Handling API Requests (routes) from the Public api
// ===========================================================================================================


var COMMON = 			'../../common/';
var util = 				require(COMMON + 'utilities/util.js');
var Logger =			require(COMMON + 'utilities/logger.js' );
var Parse = 			require('parse').Parse;
var PGClient =        	require(COMMON + 'database/pg_client.js');
var Q = 				require("q");
var SyncController = require( './sync_controller.js' );
var AuthController = require( './auth_controller.js' );



// ===========================================================================================================
// Instantiation
// ===========================================================================================================
function APIController(req, res){
	this.req = req;
	this.res = res;
	Parse.initialize( util.getOption( "applicationId" ) , util.getOption( "javaScriptKey" ) , util.getOption( "masterKey" ) );
	this.logger = new Logger();
	//this.logger.forceOutput = true;
	this.client = new PGClient( this.logger, 12000 );

};



// ===========================================================================================================
// Authorization and Request Validation
// ===========================================================================================================
APIController.prototype.validateRequest = function(){
	// TODO: Perform validation of incoming request
	return true;
};
APIController.prototype.authorize = function(callback){
	var self = this;
	this.client.validateToken( this.req.body.sessionToken , function( userId, organisationId){
		// TODO: send proper error back that fits clients handling
		if ( !userId  || !organisationId){
			var error = organisationId;
			return self.handleErrorResponse( error );
		}
		self.userId = userId;
		self.logger.setIdentifier( userId ); // Set userId in the logger to identify
		callback(userId, organisationId);
	});
};



// ===========================================================================================================
// Result handling
// ===========================================================================================================
APIController.prototype.handleResult = function(result, error){
	// Check for timeout on the client (13 seconds operations will trigger timeout)
	if(this.client.timedout)
		return this.handleErrorResponse( {code:510, message:"Request Timed Out"} );
	if( error )
		return this.handleErrorResponse(error);
	this.handleSuccessResponse(result);
}
APIController.prototype.handleErrorResponse = function(error, log){
	this.client.end();
	util.sendBackError(error, this.res);
}
APIController.prototype.handleSuccessResponse = function(result){
	this.client.end();
	this.res.send( result );
}



// ===========================================================================================================
// API Calls
// ===========================================================================================================


// Full client sync
// ===========================================================================================================
APIController.prototype.sync = function (){
	var self = this;
	this.authorize( function(userId, organisationId){
		// Successfully authed
		var syncController = new SyncController( userId, organisationId, self.client , self.logger );
		syncController.sync( self.req, self.handleResult.bind(self) );
	});
};

// Full client sync
// ===========================================================================================================
APIController.prototype.verifySlackToken = function (){
	var self = this;
	console.log("APIController | verifySlackToken");
	var authController = new AuthController( null, self.client , self.logger );
	authController.verifySlackToken( self.req, self.handleResult.bind(self) );
};

// Auth call - used to authorize integrations on server
// ===========================================================================================================
APIController.prototype.auth = function (){
	var self = this;
	// Auth for Swipes first
	this.authorize( function(userId){
		// Successfully authed for Swipes - then auth integration
		var authController = new AuthController( userId, self.client , self.logger );
		authController.auth( self.req, self.handleResult.bind(self) );
	});
};


// Add Mailbox call - used to prepare client to add Mailbox
// ===========================================================================================================
APIController.prototype.addMailbox = function(){
	var self = this;
	var authController = new AuthController( false, self.client , self.logger );
	authController.addMailbox( self.req, self.handleResult.bind(self) );
	/*this.authorize( function(userId){
		
	});*/
}

module.exports = APIController;