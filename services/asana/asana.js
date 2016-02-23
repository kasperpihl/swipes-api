var config = require('config');
var Asana = require('asana');
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

var asana = {
	request: function (authData, method, params, callback) {
		var id, asanaPromise, asanaMethod;
		var client = createClient();

		client.useOauth({
			credentials: authData.access_token
		})

		asanaMethod = getAsanaApiMethod(method, client);

		// T_TODO We have to return null if the method don't exist
		if (!asanaMethod) {
			return callback(new SwipesError('asana_sdk_not_supported_method'));
		}

		if (params.id) {
			id = params.id;
			delete(params.id);
		}

		if (id) {
			asanaPromise = asanaMethod(id, params);
		} else {
			asanaPromise = asanaMethod(params);
		}

		// T_TODO error handling
		asanaPromise
			.then(function (response) {
				callback(null, response.data);
			})
	},
	beforeAuthSave: function (data, callback) {
		var client = createClient();

		client.useOauth({
			credentials: data.access_token
		})

		client.users.me()
			.then(function (user) {
				// make this one a string
				// because we will have a problem to dissconnect it after that
				data.id = user.id + '';

				callback(null, data);
			})
	},
	authorize: function (data, callback) {
		var URL = 'https://app.asana.com/-/oauth_authorize';
		URL += '?client_id=' + asanaConfig.clientId;
		URL += '&redirect_uri=' + asanaConfig.redirectUri;
		URL += '&response_type=token';
		URL += '&state=notrandomstuff';

		callback(null, {
			type: 'oauth',
			url: URL
		});
	}
};

module.exports = asana;
