var COMMON = '../../common/';
var Collections = 	require(COMMON + 'collections/collections.js');
var util =			require(COMMON + 'utilities/util.js');
var Q = require("q");

function GmailHandler(userId, client, logger){
	this.collection = new Collections.Todo();

	this.logger = logger;
	this.client = client;

}

GmailHandler.prototype.run = function(){
	var connector = GmailConnector();
	connector.delegate = this;
}

GmailHandler.prototype.didUpdateAccessToken = function(accessToken){
	
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