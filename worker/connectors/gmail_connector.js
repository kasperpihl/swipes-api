var google 			= require('googleapis');
var gmail			= google.gmail('v1');
var OAuth2Client	= google.auth.OAuth2;
var Q				= require('q');
var _				= require('underscore');

function GmailConnector(userId, tokens){
	this.tokens 	= tokens;
	this.userId 	= userId;
	this.authed 	= false;
	this.labelIds 	= [];
}

GmailConnector.prototype.handleError = function(error){
	var deferred = Q.defer();
	
	if( error ){
		if(error.code === 401)
		{
			this.auth(this.tokens)
			.then(function(){ deferred.resolve(); })
			.fail(function(err){ deferred.reject(err); });
		}
		else
			deferred.reject();
	}
	else deferred.reject();

	return deferred.promise;
};

GmailConnector.prototype.getMessagesWithLabels = function(labels, callback ){
	console.log("getMessage", labels);
	var self = this;

	self.getAllLabels()
	.then(function(allLabels){ 	return self.findLabelIdsOrCreate(labels, allLabels); 	}) // find all label id's from all labels
	.then(function(){ console.log("labelIds", self.labelIds); return self.pullMessagesFromLabelAndUser(self.labelIds);}) // pull labeled messages
	// add untill done
	.then(function(messages){

		callback(messages);
	})
	.fail(function(error){
		callback(false, error);
	})
	.catch(function(error){
		callback(false, error);
	});
	
};



// TODO: Add API for removing labels from email (This happens if a user completes or deletes a task with Swipes label)
GmailConnector.prototype.removeLabelsFromEmails = function(emails, labels){
	
}



// =================================================================================================
// Pull all labels from Gmail
// =================================================================================================

	/*
	* @param {obj} user --> object containg all user information needed
	* @return all labels that the user has
	*/
GmailConnector.prototype.getAllLabels = function(deferred){

	var self = this;

	if(!deferred)
		deferred = Q.defer();

	gmail.users.labels.list({userId: self.userId}, function(err, response){
		if(err)
		{
			self.handleError(err)
			.then(function(){
				// Resolved the error, try again! Include deferred object to still try to resolve the promise
				self.getAllLabels(deferred);
			})
			.fail(function(){
				// Couldn't resolve!
				// Local error handling or reject
				deferred.reject(err);
			});

		}
		else{
			console.log("got all labels", response.labels.length);
			deferred.resolve(response.labels);
		}

	});

	return deferred.promise;

};





GmailConnector.prototype.findLabelIdsOrCreate = function(labels, allLabels, deferred){
	var self = this;
	if(!deferred)
		deferred = Q.defer();

	if(!_.isArray(labels))
		throw new Error('The passed "labels" parameter is not an array');

	if(!_.isArray(allLabels))
		throw new Error('The passed "allLabels" parameter is not an array');	

	var labelIds = [];

	for(var a = 0; a < labels.length; a ++){
		console.log("labels[a]",labels[a]);
		console.log();
		var indexOf = _.pluck(allLabels,"name").indexOf(labels[a]);
		console.log("indexOf",indexOf);
		if(indexOf != -1)
		{
			labelIds.push(allLabels[indexOf]);
		}

	}

	if(labelIds.length < 1)
	{
		console.log("here");
		self.createLabel(labels[0])
			.then(function(){
				console.log("created label");
				deferred.resolve();
			})
			.fail(function(error){
				console.log("create label", error);
				deferred.reject(error);
			});
	}
	else
	{

		deferred.resolve(labelIds);

	}

	return deferred.promise;

};

GmailConnector.prototype.pullMessagesFromLabelAndUser = function(labelIds, deferred){

	var self = this;

	if(!deferred)
		deferred = Q.defer();

	var request = {
		userId: self.userId,
		labelIds: labelIds,
		maxResults: 50
	};

	gmail.users.threads.list(request, function(err, messages){
		if(err)
		{
			self.handleError(err)
				.then(function(){
					// Resolved the error, try again! Include deferred object to still try to resolve the promise
					self.pullMessagesFromLabelAndUser(labelId, deferred);
				})
				.fail(function(){
					// Couldn't resolve!
					// Local error handling or reject
					deferred.reject(err);
				});
		}
		else{
			deferred.resolve(messages);
		}
	});

};

GmailConnector.prototype.createLabel = function(label, deferred){

	var self = this;

	if(!deferred)
		deferred = Q.defer();
	console.log(label);
	var request = {
		userId 		: self.userId,
		resources 	: {
			abelListVisibility: 'labelShow', 
			messageListVisibility: 'show', 
			name: label			
			}
		};

	gmail.users.labels.create(request, function(err, response){
		if(err)
		{
			self.handleError(err)
				.then(function(){
					// Resolved the error, try again! Include deferred object to still try to resolve the promise
					self.createLabel(label, deferred);
				})
				.fail(function(){
					// Couldn't resolve!
					// Local error handling or reject
					deferred.reject(err);
				});
		}
		else
			deferred.resolve(response);
	});

	return deferred.promise;

};


// =================================================================================================
// Authenticate and refresh token if needed
// =================================================================================================

GmailConnector.prototype.auth = function(){

	var deferred = Q.defer();
	
	var CLIENT_ID = '336134475796-mqcavkepb80idm0qdacd2fhkf573r4cd.apps.googleusercontent.com';
	var CLIENT_SECRET = '5heB-MAD5Qm-y1miBVic03cE';
	var REDIRECT_URL ='http://127.0.0.1:3000/auth/google/callback';
	var oauth2Client = new OAuth2Client(CLIENT_ID, CLIENT_SECRET, REDIRECT_URL);
		oauth2Client.credentials = this.tokens;

	google.options({auth: oauth2Client }); // set auth asa global default

	var date = new Date();
	var expiry = this.tokens.expiry_date;
	var now = date.getTime();
	

	if(expiry < now)
	{
		this.refreshToken(oauth2Client)
			.then(function(tokens){
				oauth2Client.credentials = tokens;
				google.options({ auth: oauth2Client }); // set auth as a global default
				
				deferred.resolve(oauth2Client);
				
			})
			.fail(function(err){
				deferred.reject(err);
			});
	}
	else{
		deferred.resolve();
	}
	return deferred.promise;
};

// =================================================================================================
// Refresh token 
// =================================================================================================

	/*
	* @param {obj} oauth2Client --> the OAuth client
	*/

GmailConnector.prototype.refreshToken = function(oauth2Client){

	var deferred = Q.defer();

	var self = this;

	oauth2Client.refreshAccessToken(function(err, tokens){
		if(err)
		{
			return deferred.reject(err);
		}


		if(self.delegate && _.isFunction(self.delegate.didUpdateAccessToken))
			self.delegate.didUpdateAccessToken(tokens.access_token);


		self.tokens = tokens;

		deferred.resolve(tokens);

	});

	return deferred.promise;

};


module.exports = GmailConnector;
