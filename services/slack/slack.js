var request = require('request');
var SlackConnector = require('./slack_connector.js');

var slack = {
	// This should be dynamically set from database, but for now this is okay
	connectionData: {
		redirect_uri: 'http://dev.swipesapp.com/oauth-success.html',
		client_id: '2345135970.9201204242',
		client_secret: '306fd7099a762968aa876d53579fa694'
	},
	request:function({authData, method, params}, callback){
		if(typeof authData !== 'object' || !authData.access_token){
			return callback('no_access_token');
		}
		SlackConnector.request(authData.access_token, method, params, function(err, res){
			if(err){
				console.log(err);
			}
			callback(err, res);
		});
	},
	search: function({authData, params}, callback){
		if(typeof authData !== 'object' || !authData.access_token){
			return callback('no_access_token');
		}
		// K_TODO: Make a parsing from our params to Slack params...
		SlackConnector.request(authData.access_token, 'search.all', params, function(err, res){
			if(err){
				console.log(err);
			}
			// K_TODO: Parse search results to our format
			callback(err, res);
		});
	},
	stream: function({authData, method, params}, stream, callback) {
		if (method === 'file') {
			if (!params.url) {
				return callback("URL is required for the file method");
			}

			request({
				url: params.url,
				headers: {
					'Authorization': 'Bearer ' + authData.access_token
				}
			}).pipe(stream);
		} else {
			return callback("Method not supported");
		}
	},
	beforeAuthSave: function (data, callback) {
		/*
		data is the return from oauth and will be:
		{
			code: '1230123.1231231',
			state: 'something'
		}
		*/
		if (!data.code) {
			return callback('no_code');
		}

		var params = {
			client_id: this.connectionData.client_id,
			client_secret: this.connectionData.client_secret,
			code: data.code,
			redirect_uri: this.connectionData.redirect_uri
		};

		SlackConnector.request(null, 'oauth.access', params, function (err, res) {
			if (err) {
				return callback(err);
			}

			delete res.ok;

			var data = {
				authData: res,
				id: res.team_id,
				show_name: res.team_name
			}

			return callback(null, data);
		})
	},
	authorize: function (data, callback) {
		var URL = 'https://slack.com/oauth/authorize';
		URL += '?client_id=' + this.connectionData.client_id;
		URL += '&scope=client';
		URL += '&redirect_uri=' + this.connectionData.redirect_uri;

		callback(null, {type: 'oauth', service: 'slack', url: URL});
	}
};

module.exports = slack;
