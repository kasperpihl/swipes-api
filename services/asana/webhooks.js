import config from 'config';
import util from 'util';
import Promise from 'bluebird';
import {
	updateCursors
} from '../../rest/utils/webhook_util.js';
import {
	createWebhookReference,
	updateWebhookReference,
	getWebhooksReferences,
	deleteWebhooksRefereces
} from '../../rest/utils/asana_webhook_util.js';

const webhooksHost = config.get('webhooksHost');

// Unsubscribe from webhooks that are referenced in our database
const unsubscribeFromAll = ({ asana, authData, userId }) => {
	return getWebhooksReferences(userId)
		.then((webhooks) => {
			console.log('Unsubscribe HOOKS', webhooks);
			return deleteWebhooksFromAsana({ asana, authData, userId }, webhooks);
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

const deleteWebhooksFromAsana = ({ asana, authData, userId }, webhooks) => {
	const promiseArray = [];
	const request = Promise.promisify(asana.request);
	const method = 'webhooks.deleteById';

	webhooks.forEach((webhook) => {
		const params = {
			id: webhook.id
		}

		promiseArray.push(request({ authData, method, params }));
	})

	return Promise.all(promiseArray.map(function(promise) {
		//http://bluebirdjs.com/docs/api/reflect.html
    return promise.reflect();
	}));
}

const subscribeToAll = ({ asana, authData, userId, accountId }) => {
  console.log('subscribing asana webhooks to all projects');

  const method = 'workspaces.findAll';
  const params = {};

  asana.request({ authData, method, params }, (err, workspaces) => {
    if (err) {
      console.log('Registering asana webhooks - Workspace Step', err);
      return;
    }

    const method = 'projects.findAll';

    workspaces.forEach((workspace) => {
      findAllProjects({ asana, authData, userId, accountId, workspace });
    })
  })
}

const findAllProjects = ({ asana, authData, userId, accountId, workspace }) => {
  const method = 'projects.findAll';
  const params = {
    workspace: workspace.id
  };

  asana.request({ authData, method, params }, (err, projects) => {
    if (err) {
      console.log('Registering asana webhooks - Projects Step', err);
      return;
    }


    projects.forEach((project) => {
      createWebhookForProject({ asana, authData, userId, accountId, project });
    })
  })
}

const createWebhookForProject = ({ asana, authData, userId, accountId, project }) => {
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

		  console.log(params);

		  asana.request({ authData, method, params }, (err, result) => {
		    if (err) {
		      console.log('Registering asana webhooks - Create webhook Step');
		      console.log(util.inspect(err, { showHidden: true, depth: null }));
		      return;
		    }

				updateWebhookReference(webhookId, result);
		    saveSyncCursor({ asana, authData, userId, accountId, projectId });
		    console.log('Registering asana webhook success', result);
		  })
		})
		.catch((err) => {
			console.log('Failed to creat a webhook reference in our db', err);
		})
}

const saveSyncCursor = ({ asana, authData, userId, accountId, projectId }) => {
  const method = 'events.get';
  const params = {
    resource: projectId
  }

  asana.request({ authData, method, params }, (err, result) => {
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
const deleteAllWorkspaceWebhooks = ({ asana, authData, userId, accountId, workspace }) => {
	const method = 'webhooks.getAll';
	const params = {
		id: workspace.id
	}

	asana.request({ authData, method, params }, (err, webhooks) => {
		if (err) {
			console.log('Ooops... can\'t get the webhooks', err);
			return;
		}

		webhooks.forEach((webhook) => {
			const method = 'webhooks.deleteById';
			const params =  {
				id: webhook.id
			}

			asana.request({ authData, method, params }, (err, res) => {
				if (err) {
					console.log('Could not delete the webhook', err);
					return;
				}

				console.log('Webhook deleted!');
			})
		})
	})
}

export {
  subscribeToAll,
	unsubscribeFromAll
}
