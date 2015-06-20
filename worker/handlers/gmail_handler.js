var COMMON = '../../common/';
var WORKER = '../';
var Collections = 		require(COMMON + 'collections/collections.js');
var util =				require(COMMON + 'utilities/util.js');
var Q = require("q");
var GmailConnector = 	require(WORKER + "connectors/gmail_connector.js");

function GmailHandler(userId, client, logger){
	this.collection = new Collections.Todo();

	this.logger = logger;
	this.client = client;

}


// ===========================================================================================================
// Main function - starting and handling the whole process 
// ===========================================================================================================
GmailHandler.prototype.run = function(settings, action){
	var deferred = Q.defer();
	this.settings = settings;
	this.action = action;

	var connector = new GmailConnector();
	connector.delegate = this;


	return deferred.promise;
}


GmailHandler.prototype.fetchEmails = function(){

}

GmailHandler.prototype.fetchTasks = function(){

}

GmailHandler.prototype.compare = function(){

}

GmailHandler.prototype.saveTasks = function(){

}

GmailHandler.prototype.saveEmails = function(){

}


// ===========================================================================================================
// Delegate method from Connector when accessToken gets updated
// ===========================================================================================================
GmailHandler.prototype.didUpdateAccessToken = function(accessToken){
	
}