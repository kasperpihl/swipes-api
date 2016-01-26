// ===========================================================================================================
// Work Controller - Handling Work Requests for the Background Worker
// ===========================================================================================================


var COMMON = 			'../../common/';
var WORKER =			'../';
var util = 				require(COMMON + 'utilities/util.js');
var Logger =			require(COMMON + 'utilities/logger.js' );

var PGClient =        	require(COMMON + 'database/pg_client.js');
var Q = 				require("q");

var Handlers =			require(WORKER + "handlers/handlers.js");


// ===========================================================================================================
// Instantiation
// ===========================================================================================================
function WorkController(req, res){
	this.req = req;
	this.res = res;
	this.logger = new Logger();
	this.logger.forceOutput = true;
	this.client = new PGClient( this.logger );

};


// ===========================================================================================================
// Do the work, called from the background queue with a message
// ===========================================================================================================
WorkController.prototype.work = function(message){
	var self = this;

	var userId = message.userId;
	// Instantiate the service handler based on the message from the queue
	
	var handler = new Handlers[message.service](userId, this.client, this.logger);
	// Start the sync process
	this.fetchSettingsForService(message.service)
	.then(function(settings){ return handler.run(settings, message); })
	.then(function(result){
		// Successfully ran integration sync
		console.log("final");
		self.client.end();
		self.res.send(result);
	})
	.fail(function(error){
		// An error occurred
		console.log(error);
		self.client.end();
		util.sendBackError(error, self.res);
	})
	.catch(function(error){
		// An exception was thrown
		console.log(error);
		self.client.end();
		util.sendBackError(error, self.res);

	});
};

WorkController.prototype.fetchSettingsForService = function(service, identifier){
	var deferred = Q.defer();
	deferred.resolve();
	return deferred.promise;
}



module.exports = WorkController;