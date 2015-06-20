var google 			= require('googleapis');
var gmail			= google.mail('v1');
var OAuth2Client	= google.auth.Oauth2;
var Q				= require('q');

function GmailConnector(){

}

/*
* @param {obj} user --> object containg all user information needed
* @return all labels that the user has
*/

GmailConnector.prototype.getAllLabels = function(user){

	var deffered = Q.deffer();

	var request = {
		userId: user.gmailUserId 
	};

	gmail.users.labels.list();

};

GmailConnector.prototype.refreshToken = function(){
	if(this.delegate && _.isFunction(this.delegate.didUpdateAccessToken))
		this.delegate.didUpdateAccessToken(accessToken);
};

GmailConnector.prototype.pullLabeledMessages = function(){

};

GmailConnector.prototype.createSwipesLabel = function(){

};

GmailConnector.prototype.auth = function(){

};