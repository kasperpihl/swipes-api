var config = require('config');
var request = require('request');
var r = require('rethinkdb');
var db = require('../../rest/db.js'); // T_TODO I should make this one a local npm module

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
	processWebhook: function (accounts, callback) {
		// Let's try for the first account only
		// Before making things more crazy
		var self = this;
		var account = accounts[0];
		var authData = account.authData;
		var method = 'files.listFolder.continue';
		var params = {
			cursor: account.list_folder_cursor
		};
		var accountId = account.id;
		var userId = account.user_id;


		var secondCallback = function (error, result) {
			if (error) {
				console.log(error);
			}

			console.log(result);

			var cursor = result.cursor;

			// T_TODO
			// Update cursor in our database
			// This shouldn't be done here ;)
			// No operations to our database should be allowed from the services
			var query = r.table('users').get(userId)
				.update({services: r.row('services')
					.map((service) => {
						return r.branch(
							service('id').eq(accountId),
							service.merge({
								list_folder_cursor: cursor
							}),
							service
						)
					})
				});

			db.rethinkQuery(query)
				.then(() => {
					console.log('Cursor updated!')
				})
				.catch((err) => {
					console.log('Error updating cursor', err);
				});

			// Repeat until there is no more pages
			if (result.has_more) {
				var params = {
					cursor: cursor
				}

				self.request({authData, method, params}, secondCallback);
			}
		}

		self.request({authData, method, params}, secondCallback);

		callback(null, 'ok');
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
			var token_type = jsonBody.token_type;
			var authData = {
				access_token: access_token,
				token_type: token_type
			};
			var method = 'users.getAccount';
			var params = {account_id: account_id};
			var data = {
				authData: authData,
				id: account_id
			};

			self.request({authData, method, params}, function (err, res) {
				if (err) {
					console.log(err);
				}

				data.show_name = res.email;

				var method = 'files.listFolder.getLatestCursor';
				var params = {
					path: '',
					recursive: true
				}

				self.request({authData, method, params}, function (err, res) {
					if (err) {
						console.log(err);
					}

					data.list_folder_cursor = res.cursor;

					return callback(null, data);
				});
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
