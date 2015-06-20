var google 			= require('googleapis');
var gmail			= google.mail('v1');
var OAuth2Client	= google.auth.Oauth2;
var Q				= require('q');

function GmailConnector(tokens){
	this.tokens = tokens;
	this.auth(tokens);
}

GmailConnector.prototype.handleError = function(error){
	var deffered = Q.defer();
	
	if( error ){
		if(error.code === 401)
		{
			this.auth(this.tokens)
			.then(function(){ deferred.resolve() })
			.fail(function(err){ deferred.reject(err) });
		}
		else
			deferred.reject();
	}
	else deferred.reject();
	return deferred.promise;
}


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
			deferred = Q.defer()

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


GmailConnector.prototype.pullLabeledMessages = function(){

};

GmailConnector.prototype.createSwipesLabel = function(){

};

// =================================================================================================
// Authenticate and refresh token if needed
// =================================================================================================

	GmailConnector.prototype.auth = function(){

		var deffered = Q.defer();

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
					
					deffered.resolve(oauth2Client);
					return deffered.promise;
				})
				.fail(function(err){
					deferred.reject(err);
				});
		}
		else
		{
			return oauth2Client;
		}

	};

// =================================================================================================
// Refresh token 
// =================================================================================================

	/*
	* @param {obj} oauth2Client --> the OAuth client
	*/

	GmailConnector.prototype.refreshToken = function(oauth2Client){

		var deffered = Q.defer();

		var self = this;

		oauth2Client.refreshAccessToken(function(err, tokens){
			if(err)
			{
				return deferred.reject(err);
			}


			if(self.delegate && _.isFunction(self.delegate.didUpdateAccessToken))
			self.delegate.didUpdateAccessToken(tokens.access_token);


			self.tokens = tokens;

			deffered.resolve(tokens);

		});

		return deffered.promise;

	};

