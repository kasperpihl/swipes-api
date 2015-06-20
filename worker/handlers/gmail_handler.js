var COMMON = '../../common/';
var WORKER = '../';
var Collections = 		require(COMMON + 'collections/collections.js');
var util =				require(COMMON + 'utilities/util.js');
var Q = require("q");
var GmailConnector = 	require(WORKER + "connectors/gmail_connector.js");

function GmailHandler(userId, client, logger){
	this.collection = new Collections.Todo();
	
	this.userId = userId;
	this.client = client;
	this.logger = logger;

}


// ===========================================================================================================
// Main function - starting and handling the whole process 
// ===========================================================================================================
GmailHandler.prototype.run = function(settings, action){
	var deferred = Q.defer(), self = this;
	this.settings = settings;
	this.action = action;

	var connector = new GmailConnector();
	connector.delegate = this;

	connector.auth()
	.then(function(){ return self.fetchEmails() })
	.then(function(){ return self.fetchTasks(); })
	.then(function(){ return self.compare(); })
	.then(function(){ return self.saveTasks(); })
	.then(function(){ return self.saveEmails(); })
	.then(function(){
		// Successfully synced with Gmail
		deferred.resolve();
	})
	.fail(function(error){
		deferred.reject(error);
	})
	.catch(function(error){
		deferred.reject(error);
	});

	return deferred.promise;
}


// ===========================================================================================================
// Fetch emails from Gmail that fits the settings
// ===========================================================================================================
GmailHandler.prototype.fetchEmails = function(){
	var deferred = Q.defer(), self = this;

	deferred.resolve();
	return deferred.promise;
}


// ===========================================================================================================
// Fetch tasks from Swipes that comes from Gmail
// ===========================================================================================================
GmailHandler.prototype.fetchTasks = function(){
	var deferred = Q.defer(), self = this;

	var query = this.collection.queryToFindTodosForService(this.userId, "gmail");
	
	this.client.performQuery(query, function(result, error){
		if( error ){
			deferred.reject(error);
		}
		else{
			self.fetchedTasks = result.rows;
			deferred.resolve();
		}
	});

	return deferred.promise;
}


// ===========================================================================================================
// Compare the tasks and emails and prepare tasks and email to be saved
// ===========================================================================================================
GmailHandler.prototype.compare = function(){
	var deferred = Q.defer(), self = this;



	deferred.resolve();
	return deferred.promise;
}


// ===========================================================================================================
// Save tasks to Swipes from Gmail
// ===========================================================================================================
GmailHandler.prototype.saveTasks = function(){
	var deferred = Q.defer(), self = this;

	deferred.resolve();
	return deferred.promise;
}


// ===========================================================================================================
// Save to Gmail with changes from Swipes
// ===========================================================================================================
GmailHandler.prototype.saveEmails = function(){
	var deferred = Q.defer(), self = this;

	deferred.resolve();
	return deferred.promise;
}


// ===========================================================================================================
// Delegate method from Connector when accessToken gets updated
// ===========================================================================================================
GmailHandler.prototype.didUpdateAccessToken = function(accessToken){
	
}