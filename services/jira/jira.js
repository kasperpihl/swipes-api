var fs = require('fs');
var serviceDir = __dirname;
var r = require('rethinkdb');
var db = require('../../rest/db.js'); // T_TODO I should make this one a local npm module
var JiraClient = require('jira-connector');

var privateKeyData = fs.readFileSync(serviceDir + '/jira-swipes.pem', 'utf8');

var jira = {
	connectionData: {
		consumerKey: 'SwipesUnicorns',
		host: 'swipes.atlassian.net'
	},
	beforeAuthSave: function (data, callback) {
		var that = this;
		var userId = data.userId;

		db.rethinkQuery(r.table('users').get(userId))
			.then(function (user) {
				token_secret = user.jira_token_secret

				JiraClient.oauth_util.swapRequestTokenWithAccessToken({
					host: that.connectionData.host,
					oauth: {
						// T_TODO find out why
						// data.oauth_token SHOULD NOT BE AN ARRAY???
							token: data.oauth_token[0],
							token_secret: token_secret,
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
						accessToken: accessToken
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
