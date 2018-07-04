import config from 'config';
import util from 'util';
import Promise from 'bluebird';
import {
  createWebhookReference,
  updateWebhookReference,
  getWebhooksReferences,
  deleteWebhooksRefereces,
} from './webhooks_db_utils';
import {
  request,
  shareRequest,
} from './request';
import {
  createSwipesShortUrl,
} from '../../swipes_url_utils';
import {
  updateCursors,
} from '../../webhook_utils';

const webhooksHost = config.get('webhooksHost');
const saveSyncCursor = ({ auth_data, user_id, accountId, projectId }) => {
  const method = 'events.get';
  const params = {
    resource: projectId,
  };
  const user = {
    id: user_id,
  };

  request({ auth_data, method, params, user }, (err, result) => {
    if (err) {
      console.log('Didn\'t get a sync token from the events API');
      console.log(util.inspect(err, { showHidden: true, depth: null }));

      return;
    }

    const cursor = result.sync;
    const cursorId = `${projectId}-${accountId}`;
    const cursors = {
      [cursorId]: cursor,
    };

    updateCursors({ user_id, accountId, cursors });
  });
};
const createWebhookForProject = ({ auth_data, user_id, accountId, project }) => {
  createWebhookReference(user_id, accountId)
    .then((dbResult) => {
      const webhookId = dbResult.generated_keys[0];
      const projectId = project.id;
      const webhookTarget = `${webhooksHost}webhooks/asana/${webhookId}`;
      const method = 'webhooks.create';
      const params = {
        resource: projectId,
        target: webhookTarget,
      };
      const user = {
        id: user_id,
      };

      request({ auth_data, method, params, user }, (err, result) => {
        if (err) {
          console.log('Registering asana webhooks - Create webhook Step');
          console.log(util.inspect(err, { showHidden: true, depth: null }));

          return;
        }

        updateWebhookReference(webhookId, result);
        saveSyncCursor({ auth_data, user_id, accountId, projectId });
        console.log('Registering asana webhook success', result);
      });
    })
    .catch((err) => {
      console.log('Failed to creat a webhook reference in our db', err);
    });
};
const findAllProjects = ({ auth_data, user_id, accountId, workspace }) => {
  const method = 'projects.findAll';
  const params = {
    workspace: workspace.id,
  };
  const user = {
    id: user_id,
  };

  request({ auth_data, method, params, user }, (err, projects) => {
    if (err) {
      console.log('Registering asana webhooks - Projects Step', err);

      return;
    }

    projects.forEach((project) => {
      createWebhookForProject({ auth_data, user_id, accountId, project });
    });
  });
};
const deleteWebhooksFromAsana = ({ auth_data, user_id }, webhooks) => {
  const promiseArray = [];
  const promiseRequest = Promise.promisify(request);
  const method = 'webhooks.deleteById';

  webhooks.forEach((webhook) => {
    const params = {
      id: webhook.id,
    };
    const user = {
      id: user_id,
    };

    promiseArray.push(promiseRequest({ auth_data, method, params, user }));
  });

  // http://bluebirdjs.com/docs/api/reflect.html
  return Promise.all(promiseArray.map(promise => promise.reflect()));
};
/* USE WITH CAUTION
  Delete all webhooks from a worspace for an account
  This exists to fix things while in development
  Don't use in production. If we have multiple swipes accounts with the same
  asana user it will delete the webhooks for every single one of them.
 */
// const deleteAllWorkspaceWebhooks = ({ asana, auth_data, user_id, accountId, workspace }) => {
//   const method = 'webhooks.getAll';
//   const params = {
//     id: workspace.id
//   }
//   const user = {
//     id: user_id
//   }
//
//   request({ auth_data, method, params, user }, (err, webhooks) => {
//     if (err) {
//       console.log('Ooops... can\'t get the webhooks', err);
//       return;
//     }
//
//     webhooks.forEach((webhook) => {
//       const method = 'webhooks.deleteById';
//       const params =  {
//         id: webhook.id
//       }
//
//       request({ auth_data, method, params, user }, (err, res) => {
//         if (err) {
//           console.log('Could not delete the webhook', err);
//           return;
//         }
//
//         console.log('Webhook deleted!');
//       })
//     })
//   })
// }

// Unsubscribe from webhooks that are referenced in our database
const unsubscribeFromAllWebhooks = ({ auth_data, user_id }) => {
  return getWebhooksReferences(user_id)
    .then((webhooks) => {
      console.log('Unsubscribe HOOKS', webhooks);

      return deleteWebhooksFromAsana({ auth_data, user_id }, webhooks);
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
      });
    })
    .then(() => {
      return deleteWebhooksRefereces(user_id);
    })
    .then(() => {
      return Promise.resolve();
    })
    .catch((err) => {
      return Promise.reject(err);
    });
};
const subscribeToAllWebhooks = ({ auth_data, user_id, accountId }) => {
  console.log('subscribing asana webhooks to all projects');

  const method = 'workspaces.findAll';
  const params = {};
  const user = {
    id: user_id,
  };

  request({ auth_data, method, params, user }, (err, workspaces) => {
    if (err) {
      console.log('Registering asana webhooks - Workspace Step', err);

      return;
    }

    workspaces.forEach((workspace) => {
      findAllProjects({ auth_data, user_id, accountId, workspace });
    });
  });
};
const createEvent = (user_id, event, accountId) => {
  const me = event.user.id === accountId;
  const createdBy = me ? 'You' : event.resource.created_by.name;
  let text;

  if (event.resource.type === 'comment') {
    text = `${createdBy} commented ${event.resource.text}`;
  } else {
    text = `${createdBy} ${event.resource.text}`;
  }

  const eventData = {
    service_name: 'asana',
    message: text,
    account_id: accountId,
    me,
  };

  return eventData;
};
const createShortUrl = (account, event, accountId) => {
  const {
    auth_data,
    user_id,
  } = account;

  if (event.parent) {
    const options = {
      auth_data,
      type: event.type,
      itemId: event.parent.id,
      user: {
        id: user_id,
      },
    };

    shareRequest(options, (err, res) => {
      if (err) {
        console.log(err);

        return;
      }

      const link = {
        service_name: 'asana',
        type: 'task',
        id: event.parent.id,
      };
      const shortUrlData = Object.assign({}, res, link);
      const eventData = createEvent(user_id, event, accountId);

      createSwipesShortUrl({ link, shortUrlData, user_id, event: eventData });
    });
  }
};
const processChanges = ({ account, result, accountId }) => {
  const events = result.data;
  const filteredEvents = events.filter((event) => {
    return event.type === 'story' && event.action !== 'removed';
  });

  filteredEvents.forEach((event) => {
    return createShortUrl(account, event, accountId);
  });
};
const webhooks = (account, resourceId, accountId, callback) => {
  const cursorId = `${resourceId}-${accountId}`;
  const {
    auth_data,
    user_id,
    cursors,
  } = account;
  const method = 'events.get';
  const user = {
    id: user_id,
  };

  if (!cursors || !cursors[cursorId]) {
    return callback('The required cursor is missing. Try reauthorize the service to fix the problem.');
  }

  const sync = cursors[cursorId];
  const resourceIdInt = +resourceId;
  const params = {
    sync,
    resource: resourceIdInt,
  };
  const secondCallback = (error, result) => {
    if (error) {
      return console.log(error);
    }

    // T_TODO bonus points if someone use result.errors
    // const errors = result.errors;
    const data = result.data;
    const sync = result.sync;

    processChanges({ account, result, accountId });

    // Repeat until there is no more pages
    if (data && data.length > 0) {
      Object.assign(params, { sync });

      return request({ auth_data, method, params, user }, secondCallback);
    }

    const cursors = {
      [cursorId]: sync,
    };

    return updateCursors({ user_id, accountId, cursors });
  };

  return request({ auth_data, method, params, user }, secondCallback);
};

export {
  unsubscribeFromAllWebhooks,
  subscribeToAllWebhooks,
  webhooks,
};
