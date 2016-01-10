var AsanaConnector = require('./asana_connector.js');
var asana = {
	// This should be dynamically set from database, but for now this is okay
	connectionData: {
		redirect_uri: 'http://dev.swipesapp.com/oauth-success.html',
		client_id: 'ASANA_CLIENT_ID',
		client_secret: 'ASANA_SECRET'
	},
	request:function(authData, method, options, callback){
		// authData is the data that was saved in beforeAuthSave
		var err = false;
		var res = 'success';
		callback(err, res);
	},
	beforeAuthSave: function(data, callback){
		// Data is the get parameters from the callback on oauth.
		// Exchange if needed for a token
		// Callback what should be saved to the user
		// callback(err, res)
	},
	authorize: function(callback){
		var URL = 'https://app.asana.com/-/oauth_authorize';
		URL += '?client_id=' + this.connectionData.client_id;
		URL += '&scope=client';
		URL += '&redirect_uri=' + this.connectionData.redirect_uri;
		return {
			type: 'oauth',
			service: 'asana',
			url: URL
		};
	}
};

module.exports = asana;