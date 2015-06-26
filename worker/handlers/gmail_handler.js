var COMMON = '../../common/';
var Collections = 		require(COMMON + 'collections/collections.js');
var util =				require(COMMON + 'utilities/util.js');
var Q = require("q");
var GmailConnector = 	require(COMMON + "connectors/gmail_connector.js");

function GmailHandler(userId, client, logger){
	this.collection = new Collections.Todo();

	var token = {
		access_token: null,
		token_type: 'Bearer',
		refresh_token: '1/KJUeF4W4rtspJv42WF7cQdoP5VQextjCtTOL11n1OQHBactUREZofsF9C7PrpE-j',
		expiry_date: null
	}
	userId = '108178009002508861945';

	this.connector = new GmailConnector(userId, token);
	this.connector.delegate = this;

	this.userId = userId;
	this.client = client;
	this.logger = logger;

}


// ===========================================================================================================
// Main function - starting and handling the whole process 
// ===========================================================================================================
GmailHandler.prototype.run = function(settings, action){
	console.log("running");
	var deferred = Q.defer(), self = this;
	this.settings = settings;
	this.action = action;

	self.logger.log("sync for gmail");
	this.connector.auth()
	.then(function(){ return self.fetchEmails(); })
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
	self.logger.time("fetch emails");
	this.connector.getMessagesWithLabels(["Add to Swipes"], function(messages, error){
		if( error ){
			deferred.reject( error );
		}
		else{
			console.log("returnMessages", messages);
			self.fetchedEmails = messages;
			deferred.resolve();
		}
	});
	return deferred.promise;
}


// ===========================================================================================================
// Fetch tasks from Swipes that comes from Gmail
// ===========================================================================================================
GmailHandler.prototype.fetchTasks = function(){
	var deferred = Q.defer(), self = this;
	self.logger.time("fetch tasks");
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
// What should happen if:
//
// A user deletes a task in Swipes (that is linked to an email)
// - Remove Swipes list-label
//
// A user completes a task in Swipes (that is linked to an email)
// - Remove Swipes list-label
//
// A user moves an email from the Swipes List (that has a task in Swipes)
// - Leave the task, but unlink it
// ===========================================================================================================
GmailHandler.prototype.compare = function(){
	var deferred = Q.defer(), self = this;
	self.logger.time("compare");
	console.log("fetchedEmails",this.fetchedEmails);
	console.log("fetchedTasks",this.fetchedTasks);
	var localId = util.generateId(12);
	var exampleTask = {
		title: "Title",
		localId: localId,
		origin: "gmail"
	};

	// To create a new task to save 
	//this.collection.newTaskFromService()

	deferred.resolve();
	return deferred.promise;
}


// ===========================================================================================================
// Save tasks to Swipes from Gmail
// ===========================================================================================================
GmailHandler.prototype.saveTasks = function(){
	var deferred = Q.defer(), self = this;
	self.logger.time("save tasks");
	this.collection.getQueriesForInsertingAndSavingObjects().then(function(queries){
		if(queries && queries.length == 0)
			return deferred.resolve();

		// Start a transaction before saving all objects
		self.client.transaction( function( error ){
			self.client.rollback();
		});
		self.client.performQueries( queries, function( result, error , i){
			self.logger.time( "finalized insertions and updates" );
			if ( error )
				return deferred.reject( error );
			
			self.client.commit(function( result, error ){
					
				if ( error )
					return deferred.reject( error);
				
				// TODO: Send silent push to other clients that an update happened
				//util.sendSilentPush([ self.userId ], { syncId: syncId });
				deferred.resolve();
			
			});

		});
	})
	.fail(function(error){
		// A validation error probably happened
		deferred.reject(error);
	});

	return deferred.promise;
}


// ===========================================================================================================
// Save to Gmail with changes from Swipes
// ===========================================================================================================
GmailHandler.prototype.saveEmails = function(){
	var deferred = Q.defer(), self = this;
	self.logger.time("save emails");
	deferred.resolve();
	return deferred.promise;
}


// ===========================================================================================================
// Delegate method from Connector when accessToken gets updated
// ===========================================================================================================
GmailHandler.prototype.didUpdateAccessToken = function(accessToken){
	
}

module.exports = GmailHandler;