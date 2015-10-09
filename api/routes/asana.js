var COMMON = '../../common/';
	express = require( 'express' ),
	Asana = require('asana'),
	Q = require('q'),
	Promise = require('bluebird'), // Asana use bluebird... go figure
	Async = require('async'), // we have to pick callbacks OR promises... not both :D
	SlackConnector = require(COMMON + 'connectors/slack_connector.js');

var router = express.Router();
var ORIGIN = process.env.ORIGIN;
var slackConnector = new SlackConnector();

// Create an Asana client. Do this per request since it keeps state that
// shouldn't be shared across requests.
function createClient() {
  return Asana.Client.create({
	// there should be some kind of conf file for things like this.
	// I don't like env vars when it is not for third party libs
    clientId: process.env.ASANA_CLIENT_ID,
    clientSecret: process.env.ASANA_CLIENT_SECRET,
    redirectUri: process.env.ASANA_REDIRECT_URL
  });
}

function handleSharedTasks(options) {
	var client = options.client;
	var tasks = options.sharedTasks;
	var deferred = Q.defer();
	var promiseArray = [];

	console.log(tasks);
	tasks.forEach(function (task) {
		// For now we care only for the first assigned project to the task
		var projectId = task.projects[0].id;

		promiseArray.push(
			client.projects.findById(projectId, {opt_fields: 'name'})
		);
	});

	Promise.all(promiseArray).then(function (result) {
		callbacksArray = [];

		result.forEach(function (project) {
			var name = encodeURIComponent(project.name);

			callbacksArray.push(
				function (callback) {
					slackConnector.request("channels.create", {name: name}, function (res, err) {
						if (res) {
							callback(null, res);
						} else {
							callback(err);
						}
					});
				}
			);
		});

		Async.parallel(callbacksArray, function (err, res) {
			console.log(err);
			console.log(res);
			deferred.resolve();
		});
	});

	return deferred.promise;
}

router.get("/asana_oauth", function (req, res) {
	var code = req.query.code;

	if (code) {
		// If we got a code back, then authorization succeeded.
		// Get token. Store it in the cookie and redirect home.
		var client = createClient();

		client.app.accessTokenFromCode(code).then(function(credentials) {
			res.cookie('asana_token', credentials.access_token, { maxAge: 60 * 60 * 1000, httpOnly: true });

			res.redirect(ORIGIN + '/#asana_import');
		});
	} else {
		// T_TODO we have to handle errors better
		res.end('Error getting authorization: ' + req.param('error'));
	}
});

router.post("/import", function (req, res) {
	var client = createClient();
	var token = req.cookies['asana_token'];
	var body = req.body;

	slackConnector.setToken(body.sessionToken);

	if (token) {
		client.useOauth({ credentials: token });

		client.users.me()
			.then(function (user) {
				var userId = user.id;
				// We are going with the default workspace for now
				var defaultWorkspaceId = user.workspaces[0].id;

				// Return a promise here
				return client.tasks.findAll({
					assignee: userId,
					workspace: defaultWorkspaceId,
					completed_since: 'now',
					opt_fields: 'id, name, completed, projects'
				});
			})
			.then(function (response) {
				return response.data;
			})
			.filter(function (task) {
				// we will import only current tasks
				// the check for name !== '' is there because in asana you have one placeholder task
				return task.name !== '' && task.completed === false;
			})
			.then(function (list) {
				// The tasks that have projects will not be private
				var privateTasks = []
				var sharedTasks = []

				list.forEach(function (task) {
					if (task.projects.length > 0) {
						sharedTasks.push(task);
					} else {
						privateTasks.push(task);
					}
				})

				//T_TODO We have to handle private tasks too
				handleSharedTasks({
					client: client,
					sharedTasks: sharedTasks
				})
				.then(function () {
					res.status(200).json({});
				})
			})
	} else {
		res.end('Missing asana token');
	}
});

router.post("/asanaToken", function (req, res) {
	var client = createClient();
	// check the user for refresher token
	var token = req.cookies['asana_token'];

	if (token) {
		// Here's where we direct the client to use Oauth with the credentials
		// we have acquired.
		client.useOauth({ credentials: token });

		client.users.me().then(function(me) {
			// We don't use redirect here because it's not allowed for cross-origin requests that require preflight.
			res.status(200).json({redirect: ORIGIN + '/#asana_import'});
		}).catch(function(err) {
			// T_TODO handle errors better
			res.end('Error fetching user: ' + err);
		});
	} else {
		// Otherwise redirect to authorization.
		var asanaAuthorizeUrl = client.app.asanaAuthorizeUrl();

		// We don't use redirect here because it's not allowed for cross-origin requests that require preflight.
		res.status(200).json({redirect: asanaAuthorizeUrl});
	}
});

module.exports = router;
