var config = require('config');
var Asana = require('asana');
var Promise = require('bluebird');
var r = require('rethinkdb');
var db = require('../../rest/db.js'); // T_TODO I should make this one a local npm module
var SwipesError = require( '../../rest/swipes-error' );

var asanaConfig = config.get('asana');

var createClient = function () {
	return Asana.Client.create({
		clientId: asanaConfig.clientId,
		clientSecret: asanaConfig.clientSecret,
		redirectUri: asanaConfig.redirectUri
	});
}

var getAsanaApiMethod = function (method, client) {
	var arr = method.split('.');
	var len = arr.length;
	var asanaMethod = client;
	var prevAsanaMethod = asanaMethod;

	for (var i=0; i<len; i++) {
		if (!asanaMethod[arr[i]]) {
			return null;
		}

		if (!asanaMethod[arr[i]].bind) {
			asanaMethod = asanaMethod[arr[i]];
		} else {
			asanaMethod = asanaMethod[arr[i]].bind(prevAsanaMethod);
		}

		prevAsanaMethod = asanaMethod;
	}

	return asanaMethod;
}

var refreshAccessToken = function (authData, user, service) {
	return new Promise(function (resolve, reject) {
		var now = new Date().getTime() / 1000;
		var expires_in = authData.expires_in - 30; // 30 seconds margin of error
		var ts_last_token = authData.ts_last_token;
		var client = createClient();
		var userId = user.userId;
		var serviceId = service.serviceId;
		var accessToken;

		if (now - ts_last_token > expires_in) {
			client.app.accessTokenFromRefreshToken(authData.refresh_token)
				.then(function (response) {
					accessToken = response.access_token;
					// T_TODO
					// Update service in our database
					// This shouldn't be done here ;)
					// No operations to our database should be allowed from the services
					var query = r.table('users').get(userId)
						.update({services: r.row('services')
							.map((service) => {
								return r.branch(
									service('id').eq(serviceId),
									service.merge({
										authData: {
											access_token: accessToken,
											ts_last_token: now
										}
									}),
									service
								)
							})
						});

					return db.rethinkQuery(query);
				})
				.then(function () {
					resolve(accessToken);
				})
				.catch(function (error) {
					reject(error);
				})
		} else {
			resolve(authData.access_token);
		}
	});
}

var asana = {
	request: function ({authData, method, params, user, service}, callback) {
		var id, asanaPromise, asanaMethod;
		var client = createClient();

		refreshAccessToken(authData, user, service)
			.then(function (accessToken) {
				client.useOauth({
					credentials: accessToken
				});

				asanaMethod = getAsanaApiMethod(method, client);

				// T_TODO We have to return null if the method don't exist
				if (!asanaMethod) {
					return Promise.reject(new SwipesError('asana_sdk_not_supported_method'));
				}

				var id = null;

				if (params.id) {
					id = params.id;
					delete(params.id);
				}

				if (id) {
					asanaPromise = asanaMethod(id, params);
				} else {
					asanaPromise = asanaMethod(params);
				}

				return asanaPromise;
			})
			.then(function (response) {
				// For some reason sometimes the response is without .data
				// In the web explorer where one can test the api
				// there is no such problem.
				// When we delete things there is no response at all...
				var data = {};

				if (response) {
					data = response.data || response;
				}

				callback(null, data);
			})
			.catch(function (error) {
				callback(error);
			})
	},
	shareRequest: function ({authData, type, params, user, service}, callback) {
		var self = this;
		var method = '';
		var actions;
		var mappedData;

		if (type === 'task') {
			method = 'tasks.findById'
		}

		this.request({authData, method, params, user, service}, function (err, res) {
			if (err) {
				return callback(err);
			}

			actions = self.cardActions(type, res);
			mappedData = self.cardData(type, res);

			return callback(null,  {
				serviceData: mappedData,
				serviceActions: actions
			});
		})
	},
	cardData: function (type, data) {
		var mappedData;

		if (type === 'task') {
			mappedData = {
				title: data.name || ''
			}
		}

		return mappedData;
	},
	cardActions: function (type, data) {
		var actions = [];

		if (type === 'task') {
			if (!data.completed) {
				actions.push({
					label: 'Complete',
					icon: 'check',
					bgColor: 'green',
					method: 'tasks.update',
					data: {
						id: data.id,
						completed: true
					}
				})
			} else {
				actions.push({
					label: 'Undo',
					icon: 'check',
					bgColor: 'gray',
					method: 'tasks.update',
					data: {
						id: data.id,
						completed: false
					}
				})
			}
		}

		return actions;
	},
	beforeAuthSave: function (data, callback) {
		var client = createClient();
		var code = data.code;
		var data = {};

		client.app.accessTokenFromCode(code)
			.then(function (response) {
				// Need that for the refresh token
				response.ts_last_token = new Date().getTime() / 1000;

				data = {
					authData: response,
					id: response.data.id,
					show_name: response.data.email
				}

				callback(null, data);
			})
			.catch(function (error) {
				console.log(error);
				callback(error);
			})
	},
	authorize: function (data, callback) {
		var client = createClient();
		var url = client.app.asanaAuthorizeUrl();

		callback(null, {
			type: 'oauth',
			url: url
		});
	}
};

module.exports = asana;
