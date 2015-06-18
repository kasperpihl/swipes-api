var ROOT = '../../';
var keys = 				require(ROOT + 'utilities/keys.js');
var util = 				require(ROOT + 'utilities/util.js');
var Logger =			require(ROOT + 'utilities/logger.js' );
var Parse = 			require('parse').Parse;
var PGClient =        	require(ROOT + 'database/pg_client.js');

var SyncController = require( './sync_controller.js' );


function APIController(){
	Parse.initialize( keys.get( "applicationId" ) , keys.get( "javaScriptKey" ) , keys.get( "masterKey" ) );
	this.logger = new Logger();
	this.client = new PGClient( logger, 12000 );

};
APIController.prototype.validateRequest = function(req){
	return true;
}
APIController.prototype.handleError = function(error){
	this.client.end();
	util.sendBackError(error, this.res);
}
APIController.prototype.authorize = function(req, res, callback){
	var self = this;
	this.client.validateToken( req.body.sessionToken , function( userId, error){
		// TODO: send proper error back that fits clients handling
		if ( error )
			return self.handleError( error );
		self.logger.setIdentifier( userId ); // Set userId in the logger to identify
		callback(userId);

		var syncController = new SyncController( self.client , self.logger );
		if ( req.body.hasMoreToSave )
			syncController.hasMoreToSave = true;


		syncController.sync( req.body, userId, function( result , error ){
			self.logger.time('Finished request', true);
			if(client.timedout){
				util.sendBackError( {code:510, message:"Request Timed Out"} , res, self.logger.logs );
				return;
			}
			client.end();
			if ( result ){
				if ( req.body.sendLogs ){
					result['logs'] = logger.logs;
				}

				result['intercom-hmac'] = util.getIntercomHmac(userId);
				res.send( result );
			}
			else{
				self.logger.sendErrorLogToParse( error, req.body );
				util.sendBackError( error , res, logger.logs );
			}

		});
	});
}



APIController.prototype.sync = function ( req, res, next ){
	this.res = res;
	this.authorize( req, )
};






exports.sync = function(req, res, next){


};


module.exports = APIController;