var config = require('config');
var request = require('request');
var serviceDir = __dirname;
var dropboxConfig = config.get('dropbox');

var camelCaseToUnderscore = function (word) {
	// http://stackoverflow.com/questions/30521224/javascript-convert-camel-case-to-underscore-case
	return word.replace(/([A-Z]+)/g, function (x,y){return "_" + y.toLowerCase()}).replace(/^_/, "");
}

var getDropboxApiMethod = function (method) {
	var pathItems = method.split('.');
	var path = '';

	pathItems.forEach(function (item) {
		path = path + '/' + camelCaseToUnderscore(item);
	})

	return path;
}

var dropbox = {
	request: function ({authData, method, params}, callback) {
		var options = {
			method: 'post',
			body: params,
			json: true,
			url: 'https://api.dropboxapi.com/2' + getDropboxApiMethod(method),
			headers : {
				Authorization: 'Bearer ' + authData.access_token,
				'Content-Type': 'application/json'
			}
		}

		request(options, function (err, res, body) {
		  if (err) {
		    console.log(err);
		  }

			callback(err, body);
		});
	},
	beforeAuthSave: function (data, callback) {
		var self = this;
		var options = {
			method: 'post',
			form: {
				code: data.code,
				grant_type: 'authorization_code',
				client_id: dropboxConfig.appId,
				client_secret: dropboxConfig.appSecret,
				redirect_uri: dropboxConfig.redirectURI
			},
			url: 'https://api.dropboxapi.com/oauth2/token'
		}

		request(options, function (err, res, body) {
			if (err) {
				console.log(err);
			}

			var jsonBody = JSON.parse(body);
			var account_id = jsonBody.account_id;
			var access_token = jsonBody.access_token;
			var authData = {access_token: access_token};
			var method = 'users.getAccount';
			var params = {account_id: account_id};
			var data = jsonBody;

			self.request({authData, method, params}, function (err, res) {
				if (err) {
					console.log(err);
				}

				data.uniq_id = res.account_id;
				data.show_name = res.email;

				return callback(null, data);
			})
		})
	},
	authorize: function (data, callback) {
    var URL = 'https://www.dropbox.com/oauth2/authorize';
    URL += '?response_type=code'
		URL += '&client_id=' + dropboxConfig.appId;
		URL += '&redirect_uri=' + dropboxConfig.redirectURI;
		// T_TODO state for better security

		callback(null, {type: 'oauth', url: URL});
	}
};

module.exports = dropbox;
