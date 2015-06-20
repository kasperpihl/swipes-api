var google 			= require('googleapis');
var gmail			= google.mail('v1');
var OAuth2Client	= google.auth.Oauth2;
var Q				= require('q');

function GmailConnector(tokens){
	this.tokens = tokens;
}

// =================================================================================================
// Pull all labels from Gmail
// =================================================================================================

	/*
	* @param {obj} user --> object containg all user information needed
	* @return all labels that the user has
	*/
	GmailConnector.prototype.getAllLabels = function(gmailUserId){

		var self = this;

		var deffered = Q.deffer();

		self.auth(self.tokens);

		gmail.users.labels.list({userId: gmailUserId}, function(err, response){
			if(err)
			{
				if(err.code === 401)
				{
					self.auth(tokens);
					self.getAllLabels(gmailUserId, self.tokens);
				}
			}

			deffered.resolve(response);

		});

		return deffered.promise;

	};


GmailConnector.prototype.pullLabeledMessages = function(){

	var self = this;

	var deffered = Q.defer();

	var request = {

	}

	gmail.users.threads.list(request, function(err, messages){
		if(err)
		{
			if(err.code === 401)
			{
				self.auth();
				
			}
		}
	});

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
				console.log('GMAIL ERROR: ' + err);
				return;
			}


			if(self.delegate && _.isFunction(self.delegate.didUpdateAccessToken))
			self.delegate.didUpdateAccessToken(tokens.access_token);


			self.tokens = tokens;

			deffered.resolve(tokens);

		});

		return deffered.promise;

	};

