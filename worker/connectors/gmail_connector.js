var google 			= require('googleapis');
var gmail			= google.gmail('v1');
var OAuth2Client	= google.auth.Oauth2;
var Q				= require('q');

function GmailConnector(tokens){
	this.tokens = tokens;
	this.authed = false;
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


// =================================================================================================
// Pull all labels from Gmail
// =================================================================================================

	/*
	* @param {obj} user --> object containg all user information needed
	* @return all labels that the user has
	*/
	GmailConnector.prototype.getAllLabels = function(gmailUserId, deferred){

		var self = this;
	
		if(!deferred)
			deferred = Q.defer();

		gmail.users.labels.list({userId: gmailUserId}, function(err, response){
			if(err)
			{
				self.handleError(err)
				.then(function(){
					// Resolved the error, try again! Include deferred object to still try to resolve the promise
					self.getAllLabels(gmailUserId, deferred);
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


GmailConnector.prototype.pullMessagesFromLabelAndUser = function(label, userId, deferred){

	var self = this;

	if(!deferred)
		deferred = Q.defer();

	// DO STUFF



	var request = {
		userId: userId,
		labelIds: labelId,
		maxResults: 50
	};

	gmail.users.threads.list(request, function(err, messages){
		if(err)
		{
			self.handleError(err)
				.then(function(){
					// Resolved the error, try again! Include deferred object to still try to resolve the promise
					self.pullMessagesFromLabelAndUserId(labelId, userId, deferred);
				})
				.fail(function(){
					// Couldn't resolve!
					// Local error handling or reject
					deferred.reject(err);
				});
		}
	});

};

GmailConnector.prototype.createSwipesLabel = function(){

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

		var data = new Date();
		var expiry = this.tokens.expiry_date;



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

