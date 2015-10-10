var COMMON = '../../common/';
	express = require( 'express' ),
	Asana = require('asana'),
	Q = require('q'),
	Promise = require('bluebird'), // Asana use bluebird... go figure
	Async = require('async'), // we have to pick callbacks OR promises... not both :D
	SlackConnector = require(COMMON + 'connectors/slack_connector.js'),
	util = require(COMMON + 'utilities/util.js');
	pg = require('pg'),
	getSlug = require('speakingurl');

var ORIGIN = process.env.ORIGIN;
var DATABASE_URL = process.env.DATABASE_URL;

var router = express.Router();
var slackConnector = new SlackConnector();

pg.defaults.poolSize = 100;

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

// performQuery the promise way
function performQuery(query) {
	var deferred = Q.defer();

	pg.connect(DATABASE_URL, function(err, client, done) {
		if(err) {
			deferred.reject(new Error("Could not connect to postgres " + JSON.stringify(err)));
		}

		client.query(query, function(err, result) {
			if(err) {
				deferred.reject(new Error("Error running query " + JSON.stringify(err)));
			}

			done();
			deferred.resolve(result);
		});
	});

	return deferred.promise;
}

function getSlackChannels() {
	var deferred = Q.defer();

	slackConnector.request("channels.list", {}, function (res, err) {
		if (err) {
			deferred.reject(err);
		}

		deferred.resolve(res);
	})

	return deferred.promise;
}

function handlePrivateTasks(options) {
	var tasks = options.tasks;
	var deferred = Q.defer();
	var promiseArray = [];

	tasks.forEach(function (task) {
		// check if the task is already in the database
		var query = {
				name: "if_exist_with_asana_id",
				text: "SELECT id FROM todo WHERE asana_id=$1",
				values: [task.id]
			}

		promiseArray.push(
			performQuery(query)
		)
	})

	Q.all(promiseArray).then(function (results) {
		var tasksToInsert = [];

		results.forEach(function (result, idx) {
			// There is no task with that asana_id.. we should add it
			if (result.rows.length === 0) {
				tasksToInsert.push(tasks[idx]);
			}
		});

		if (tasksToInsert.length === 0) {
			deferred.resolve();
		}

		slackConnector.request("auth.test", {}, function(data, error) {
			if (error) {
				deferred.reject(new Error(error));
			}

			var ownerId = data['team_id'];
			var userId = data['user_id'];

			tasksToInsert.forEach(function (task) {
				var promiseArray = [];
				var localId = util.generateId(12);
				var deleted = false;
				var query = {
					name : "insert_todo_asana",
					text: 'INSERT into todo (title, "ownerId", "userId", deleted, "updatedAt", asana_id, "localId", schedule, assignees, "toUserId") VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)',
					values: [
						task.name,
						ownerId,
						userId,
						'false',
						'now()',
						task.id,
						localId,
						'now()',
						'null',
						userId
					]
				};

				promiseArray.push(
					performQuery(query)
				);

				Q.all(promiseArray).then(function () {
					deferred.resolve();
				}).fail(function (err) {
					deferred.reject(new Error(err));
				})
			});
		});
	}).fail(function (err) {
		deferred.reject(new Error("Error while checking for duplicated tasks"));
	});

	return deferred.promise;
}

function handleSharedTasks(options) {
	var client = options.client;
	var tasks = options.tasks;
	var deferred = Q.defer();
	var promiseArray = [];
	var uniqueProjects = []

	tasks.forEach(function (task) {
		// For now we care only for the first assigned project to the task
		var projectId = task.projects[0].id;

		if (uniqueProjects.indexOf(projectId) === -1) {
			uniqueProjects.push(projectId);
		}
	});

	uniqueProjects.forEach(function (projectId) {
		promiseArray.push(
			client.projects.findById(projectId, {opt_fields: 'name'})
		);
	});

	Promise.all(promiseArray).then(function (projects) {
		var callbacksArray = [];

		projects.forEach(function (project) {
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
			if (err) {
				deferred.reject(new Error("Something went wrong with the slack create channel thing."));
			}

			var promiseArray = [];

			tasks.forEach(function (task) {
				var query = {
						name: "if_exist_with_asana_id",
						text: "SELECT id FROM todo WHERE asana_id=$1",
						values: [task.id]
					}

				promiseArray.push(
					// check if the task is already in the database
					performQuery(query)
				);
			})

			Q.all(promiseArray).then(function (results) {
				// Get channels ids
				getSlackChannels().then(function (res) {
					var tasksToInsert = [];
					var filteredChannels = {};
					var slackChannels = res.channels || [];

					results.forEach(function (result, idx) {
						// There is no task with that asana_id.. we should add it
						if (result.rows.length === 0) {
							tasksToInsert.push(tasks[idx]);
						}
					});

					projects.forEach(function (project) {
						var name = getSlug(project.name);

						slackChannels.forEach(function (channel) {
							if (name === channel.name) {
								filteredChannels[channel.name] = channel.id;
							}
						})
					});

					slackConnector.request("auth.test", {}, function(data, error) {
						if (error) {
							deferred.reject(new Error(error));
						}

						var ownerId = data['team_id'];
						var userId = data['user_id'];

						if (tasksToInsert.length === 0) {
							deferred.resolve();
						}

						tasksToInsert.forEach(function (task) {
							var projectId = task.projects[0].id;
							var slackChannelId = null;
							var promiseArray = [];
							var localId = util.generateId(12);
							var deleted = false;

							projects.forEach(function (project) {
								if (project.id === projectId) {
									slackChannelId = filteredChannels[getSlug(project.name)];
								}
							});

							var query = {
								name : "insert_shared_todo_asana",
								text: 'INSERT into todo (title, "projectLocalId", "ownerId", "userId", deleted, "updatedAt", asana_id, "localId", schedule, assignees) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)',
								values: [
									task.name,
									slackChannelId,
									ownerId,
									userId,
									'false',
									'now()',
									task.id,
									localId,
									'now()',
									'["'+ userId +'"]'
								]
							};

							promiseArray.push(
								performQuery(query)
							);

							Q.all(promiseArray).then(function () {
								deferred.resolve();
							}).fail(function (err) {
								deferred.reject(new Error(err));
							})
						});
					});
				}).fail(function (err) {
					deferred.reject(new Error(err));
				});
			}).fail(function (err) {
				deferred.reject(new Error("Something went wrong with check for asana_id in our database."));
			});
		});
	}).catch(function (e) {
		deferred.reject(new Error(e));
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

				Q.all([
					handlePrivateTasks({client: client, tasks: privateTasks}),
					handleSharedTasks({client: client, tasks: sharedTasks})
				])
				.then(function () {
					res.status(200).json({});
				}).fail(function (err) {
					console.log(err);
					res.status(400).json({})
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
