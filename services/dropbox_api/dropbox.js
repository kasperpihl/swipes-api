var config = require('config');
var r = require('rethinkdb');
var request = require('request');
var db = require('../../rest/db.js'); // T_TODO I should make this one a local npm module
var SwipesError = require( '../../rest/swipes-error' );
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
	request: function (authData, method, params, callback) {
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

			callback(err, res);
		});
	},
	beforeAuthSave: function (data, callback) {
		data.id = data.uid;

		return callback(null, data);
	},
	authorize: function (data, callback) {
    var URL = 'https://www.dropbox.com/1/oauth2/authorize';
    URL += '?response_type=token'
		URL += '&client_id=' + dropboxConfig.appId;
		URL += '&redirect_uri=' + dropboxConfig.redirectURI;
    URL += '&force_reapprove=true'; // this is only for testing
    // It will be good to implement the state parameter for better security

		callback(null, {type: 'oauth', service: 'dropbox', url: URL});
	}
};

module.exports = dropbox;
