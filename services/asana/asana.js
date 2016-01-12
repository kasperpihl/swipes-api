var Asana = require('asana');

var asana = {
	// This should be dynamically set from database, but for now this is okay
	connectionData: {
		redirect_uri: 'http://dev.swipesapp.com/oauth-success.html',
		client_id: 79054685042235,
		client_secret: 'eeac87abedd54540813d0eba2901bdad'
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

		asanaClient.useOauth();
		asanaClient.app.accessTokenFromCode(data.code).then(function (credentials) {
			console.log('success asana', credentials);
			callback(null, credentials);
		}).catch(function(e){
			callback('error asana', e);
			console.log('eer', e);
		});
	},
	authorize: function (callback) {
		var URL = 'https://app.asana.com/-/oauth_authorize';
		URL += '?client_id=' + this.connectionData.client_id;
		URL += '&response_type=code';
		URL += '&scope=default';
		URL += '&redirect_uri=' + this.connectionData.redirect_uri;
		URL += '&state=hahaha2';

		return {
			type: 'oauth',
			service: 'asana',
			url: URL
		};
	}
};

module.exports = asana;
