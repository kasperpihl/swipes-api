var Asana = require('asana');

var asana = {
	// This should be dynamically set from database, but for now this is okay
	connectionData: {
		redirect_uri: 'http://localhost:3000/oauth-success.html',
		client_id: '55104337606444',
		client_secret: 'ef862c7ddea4a517d61e5c345812e9eb'
	},
	request: function (authData, method, options, callback) {
		// authData is the data that was saved in beforeAuthSave
		var err = false;
		var res = 'success';
		callback(err, res);
	},
	beforeAuthSave: function (data, callback) {
		var asanaClient = Asana.Client.create({
	    clientId: this.connectionData.client_id,
	    clientSecret: this.connectionData.client_secret,
	    redirectUri: this.connectionData.redirect_uri
  	});

		asanaClient.app.accessTokenFromCode(data.code).then(function (credentials) {
			console.log(credentials);
		});
		console.log('ready for auth save', data);
		callback('not_built_yet');
		// Data is the get parameters from the callback on oauth.
		// Exchange if needed for a token
		// Callback what should be saved to the user
		// callback(err, res)
		// needs to call the oauth_token stuff
	},
	authorize: function (callback) {
		var URL = 'https://app.asana.com/-/oauth_authorize';
		URL += '?client_id=' + this.connectionData.client_id;
		URL += '&response_type=code';
		URL += '&redirect_uri=' + this.connectionData.redirect_uri;
		URL += '&state=hahaha';

		return {
			type: 'oauth',
			service: 'asana',
			url: URL
		};
	}
};

module.exports = asana;
