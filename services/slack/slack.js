var SlackConnector = require('./slack_connector.js');
var slack = {
	// This should be dynamically set from database, but for now this is okay
	connectionData: {
		redirect_uri: 'http://dev.swipesapp.com/oauth-success.html',
		client_id: '2345135970.9201204242',
		client_secret: '306fd7099a762968aa876d53579fa694'
	},
	request:function(authData, method, options, callback){
		if(typeof authData !== 'object' || !authData.access_token){
			return callback('no_access_token');
		}
		SlackConnector.request(authData.access_token, method, options, function(err, res){
			if(err){
				console.log(err);
			}
			callback(err, res);
		});
	},
	beforeAuthSave: function(data, callback){
		/*
		data is the return from oauth and will be:
		{ 
			code: '1230123.1231231',
			state: 'something'
		}
		*/
		if(!data.code)
			return callback('no_code');
		var params = {
			client_id: this.connectionData.client_id,
			client_secret: this.connectionData.client_secret,
			code: data.code,
			redirect_uri: this.connectionData.redirect_uri
		};
		SlackConnector.request(null, 'oauth.access', params, function(err, res){
			if(!err && res.ok){
				delete res.ok;
				// Setting a unique ID that should prevent double auth
				res.id = res.team_id;
				return callback(null, res);
			}
			callback(err);
		})
	},
	authorize: function(callback){
		var URL = 'https://slack.com/oauth/authorize';
		URL += '?client_id=' + this.connectionData.client_id;
		URL += '&scope=client';
		URL += '&redirect_uri=' + this.connectionData.redirect_uri;
		return {
			type: 'oauth',
			service: 'slack',
			url: URL
		};
	}
};

module.exports = slack;