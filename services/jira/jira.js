var fs = require('fs');
var serviceDir = __dirname;
var r = require('rethinkdb');
var db = require('../../rest/db.js'); // T_TODO I should make this one a local npm module
var SwipesError = require( '../../rest/swipes-error' );
var JiraClient = require('jira-connector');

var privateKeyData = fs.readFileSync(serviceDir + '/jira-swipes.pem', 'utf8');

var getJiraApiMethod = function (method, jiraClient) {
	var arr = method.split('.');
	var len = arr.length;
	var jiraMethod = jiraClient;
	var prevJiraMethod = jiraMethod;

	for (var i=0; i<len; i++) {
		if (!jiraMethod[arr[i]]) {
			return null;
		}

		if (!jiraMethod[arr[i]].bind) {
			jiraMethod = jiraMethod[arr[i]];
		} else {
			jiraMethod = jiraMethod[arr[i]].bind(prevJiraMethod);
		}

		prevJiraMethod = jiraMethod;
	}

	return jiraMethod;
}

var jira = {
	connectionData: {
		consumerKey: 'SwipesUnicorns',
		host: 'swipes.atlassian.net'
	},
	request: function (authData, method, params, callback) {
		if (!authData && !authData.access_token) {
			return callback('no_access_token');
		}

		if (!authData && !authData.token_secret) {
			return callback('no_token_secret');
		}

		var jiraClient = new JiraClient({
			host: this.connectionData.host,
			oauth: {
				consumer_key: this.connectionData.consumerKey,
				private_key: privateKeyData,
				token: authData.access_token,
				token_secret: authData.token_secret
			}
		});

		var jiraMethod = getJiraApiMethod(method, jiraClient);

		if (!jiraMethod) {
			return callback(new SwipesError('jira-connector_not_supported_method'));
		}
		try {
			jiraMethod(params, function (error, result) {
				if (error) {
					if (error.errorMessages) {
						error = error.errorMessages[0];
					}

					return callback(error);
				}

				return callback(null, result);
			});
		}
		catch (e) {
			console.log('catching', e);
			callback(e);
		};

	},
	beforeAuthSave: function (data, callback) {
		var that = this;
		var userId = data.userId;
		var tokenSecret;

		db.rethinkQuery(r.table('users').get(userId))
			.then(function (user) {
				tokenSecret = user.jira_token_secret

				JiraClient.oauth_util.swapRequestTokenWithAccessToken({
					host: that.connectionData.host,
					oauth: {
						// T_TODO find out why
						// data.oauth_token SHOULD NOT BE AN ARRAY???
							token: data.oauth_token[0],
							token_secret: tokenSecret,
							oauth_verifier: data.oauth_token[1],
							consumer_key: that.connectionData.consumerKey,
							private_key: privateKeyData
				    }
				}, function (error, accessToken) {
					if (error) {
						return callback(error);
					}

					// T_TODO I should find something unique to identify the service
					var data = {
						access_token: accessToken,
						token_secret: tokenSecret
					}

					callback(null, data);
				});
			})
			.catch(function (err) {
				callback(err);
			});
	},
	authorize: function (data, callback) {
		var that = this;
		var userId = data.userId;

		JiraClient.oauth_util.getAuthorizeURL({
		    host: that.connectionData.host,
		    oauth: {
		        consumer_key: that.connectionData.consumerKey,
		        private_key: privateKeyData
		    }
		}, function (error, oauth) {
				if (error) {
					return callback(error);
				}
				//T_TODO I will make this better
				// I just have to keep this thing somewhere for now...
				// OMG JIRA... WHAT HAVE YOU DONE
				db.rethinkQuery(r.table('users').get(userId).update({jira_token_secret: oauth.token_secret}));
				callback(null, {type: 'oauth', service: 'slack', url: oauth.url});
		});
	}
};

module.exports = jira;
