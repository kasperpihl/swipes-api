var COMMON = '../../common/';
var Collections = 	require(COMMON + 'collections/collections.js');
var util =			require(COMMON + 'utilities/util.js');
var Q = require("q");

function GmailHandler(userId, client, logger){
	this.collection = new Collections.Todo();

	
	this.logger = logger;
	this.client = client;

}


// ===========================================================================================================
// Main function - starting and handling the whole process 
// ===========================================================================================================
GmailHandler.prototype.run = function(settings, action){
	this.settings = settings;
	this.action = action;
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

GmailHandler