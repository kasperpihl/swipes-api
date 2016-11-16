"use strict";

import config from 'config';
import util from 'util';
import Promise from 'bluebird';
import {
	createWebhookReference,
	updateWebhookReference,
	getWebhooksReferences,
	deleteWebhooksRefereces
} from './webhooks_db_utils.js';
import {
  request,
	shareRequest
} from './request';
import {
	createSwipesShortUrl
} from '../../swipes_url_utils.js';
import {
	updateCursors
} from '../../webhook_utils.js';

const webhooksHost = config.get('webhooksHost');

const findAllProjects = ({ authData, userId, accountId, workspace }) => {
  const method = 'projects.findAll';
  const params = {
    workspace: workspace.id
  };
	const user = {
		userId
	}

  request({ authData, method, params, user }, (err, projects) => {
    if (err) {
      console.log('Registering asana webhooks - Projects Step', err);
      return;
    }


    projects.forEach((project) => {
      createWebhookForProject({ authData, userId, accountId, project });
    })
  })
}

const deleteWebhooksFromAsana = ({ authData, userId }, webhooks) => {
	const promiseArray = [];
	const promiseRequest = Promise.promisify(request);
	const method = 'webhooks.deleteById';

	webhooks.forEach((webhook) => {
		const params = {
			id: webhook.id
		}
		const user = {
			userId
		}

		promiseArray.push(promiseRequest({ authData, method, params, user }));
	})

	return Promise.all(promiseArray.map(function(promise) {
		//http://bluebirdjs.com/docs/api/reflect.html
    return promise.reflect();
	}));
}

const createWebhookForProject = ({ authData, userId, accountId, project }) => {
	createWebhookReference(userId, accountId)
		.then((result) => {
			const webhookId = result.generated_keys[0];
			const projectId = project.id;
			const webhookTarget = webhooksHost + 'webhooks/asana/' + webhookId;
			const method = 'webhooks.create';
		  const params = {
		    resource: projectId,
		    target: webhookTarget
		  };
			const user = {
				userId
			}

		  console.log(params);

		  request({ authData, method, params, user }, (err, result) => {
		    if (err) {
		      console.log('Registering asana webhooks - Create webhook Step');
		      console.log(util.inspect(err, { showHidden: true, depth: null }));
		      return;
		    }

				updateWebhookReference(webhookId, result);
		    saveSyncCursor({ authData, userId, accountId, projectId });
		    console.log('Registering asana webhook success', result);
		  })
		})
		.catch((err) => {
			console.log('Failed to creat a webhook reference in our db', err);
		})
}

const saveSyncCursor = ({ authData, userId, accountId, projectId }) => {
  const method = 'events.get';
  const params = {
    resource: projectId
  }
	const user = {
		userId
	}

  request({ authData, method, params, user }, (err, result) => {
    if (err) {
      console.log('Didn\'t get a sync token from the events API');
      console.log(util.inspect(err, { showHidden: true, depth: null }));
      return;
    }

    const cursor = result.sync;
    const cursorId = projectId + '-' + accountId;
    const cursors = {
      [cursorId]: cursor
    }

    updateCursors({ userId, accountId, cursors });
  })
}

/* USE WITH CAUTION
	Delete all webhooks from a worspace for an account
	This exists to fix things while in development
	Don't use in production. If we have multiple swipes accounts with the same
	asana user it will delete the webhooks for every single one of them.
 */
// const deleteAllWorkspaceWebhooks = ({ asana, authData, userId, accountId, workspace }) => {
// 	const method = 'webhooks.getAll';
// 	const params = {
// 		id: workspace.id
// 	}
// 	const user = {
// 		userId
// 	}
//
// 	request({ authData, method, params, user }, (err, webhooks) => {
// 		if (err) {
// 			console.log('Ooops... can\'t get the webhooks', err);
// 			return;
// 		}
//
// 		webhooks.forEach((webhook) => {
// 			const method = 'webhooks.deleteById';
// 			const params =  {
// 				id: webhook.id
// 			}
// 			const user = {
// 				userId
// 			}
//
// 			request({ authData, method, params, user }, (err, res) => {
// 				if (err) {
// 					console.log('Could not delete the webhook', err);
// 					return;
// 				}
//
// 				console.log('Webhook deleted!');
// 			})
// 		})
// 	})
// }

// Unsubscribe from webhooks that are referenced in our database
const unsubscribeFromAll = ({ authData, userId }) => {
	return getWebhooksReferences(userId)
		.then((webhooks) => {
			console.log('Unsubscribe HOOKS', webhooks);
			return deleteWebhooksFromAsana({ authData, userId }, webhooks);
		})
		.then((inspections) => {
			// If the error message is NOT FOUND that simply meens that our webhooks are out of sync
			// so we don't care about that error and continue
			inspections.forEach((inspection) => {
				if (!inspection.isFulfilled()) {
					const reason = inspection.reason();

					if (reason.message.startsWith('Not Found') ||
							reason.message.startsWith('webhook: Not a recognized ID')) {
						throw reason;
					}
				}
			})
		})
		.then(() => {
			return deleteWebhooksRefereces(userId);
		})
		.then(() => {
			return Promise.resolve();
		})
		.catch((err) => {
			return Promise.reject(err);
		})
}

const subscribeToAll = ({ authData, userId, accountId }) => {
  console.log('subscribing asana webhooks to all projects');

  const method = 'workspaces.findAll';
  const params = {};
	const user = {
		userId
	}

  request({ authData, method, params, user }, (err, workspaces) => {
    if (err) {
      console.log('Registering asana webhooks - Workspace Step', err);
      return;
    }

    const method = 'projects.findAll';

    workspaces.forEach((workspace) => {
      findAllProjects({ authData, userId, accountId, workspace });
    })
  })
}

const processChanges = ({ account, result, accountId }) => {
	const events = result.data;
	const filteredEvents = events.filter((event) => {
		return event['type'] === 'story' && event['action'] !== 'removed';
	});

	filteredEvents.forEach((event) => {
		createShortUrl(account, event, accountId);
	})
}

const createShortUrl = (account, event, accountId) => {
	const {
		authData,
		user_id
	} = account
	const userId = user_id; // T_TODO omg... this is just stupid

	if (event.parent) {
		const options = {
			authData,
			type: event.type,
			itemId: event.parent.id,
			user: { userId }
		};

		shareRequest(options, (err, res) => {
			if (err) {
        console.log(err);
        return;
      }

			const shortUrlData = res;
			const link = {
				service: 'asana',
				type: 'task',
				id: event.parent.id
			}
			const eventData = createEvent(userId, event, accountId);

			createSwipesShortUrl({ link, shortUrlData, userId, event: eventData });
		})
	}
}

const createEvent = (userId, event, accountId) => {
	const me = event.user.id === accountId;
	const createdBy = me ? 'You' : event.resource.created_by.name;
	let text;

	if (event.resource.type === 'comment') {
		text = createdBy + ' commented ' + event.resource.text;
	} else {
		text = createdBy + ' ' + event.resource.text;
	}

	const eventData = {
		service: 'asana',
		message: text,
		account_id: accountId,
		me
	}

	return eventData;
}

const webhooks = (account, resourceId, accountId, callback) => {
	const cursorId = resourceId + '-' + accountId;
	const {
		authData,
		user_id,
		cursors
	} = account;
	const method = 'events.get';
	const userId = user_id;
	const user = { userId };

	if (!cursors || !cursors[cursorId]) {
		return callback('The required cursor is missing. Try reauthorize the service to fix the problem.');
	}

	const sync = cursors[cursorId];
	const resourceIdInt = +resourceId;
	const params = {
		resource: resourceIdInt,
		sync: sync
	};

	const secondCallback = (error, result) => {
		if (error) {
			return console.log(error);
		}

		// T_TODO bonus points if someone use result.errors
		const errors = result.errors;
		const data = result.data;

		const sync = result.sync;

		processChanges({ account, result, accountId });

		// Repeat until there is no more pages
		if (data && data.length > 0) {
			Object.assign(params, { sync });

			request({ authData, method, params, user }, secondCallback);
		} else {
			const cursors = {
				[cursorId]: sync
			}

			updateCursors({ userId, accountId, cursors });
		}
	}

	request({ authData, method, params, user }, secondCallback);
}

export {
  unsubscribeFromAll,
  subscribeToAll,
  webhooks
}
