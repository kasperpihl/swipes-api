"use strict";

import r from 'rethinkdb';
import req from 'request';
import Promise from 'bluebird';
import { createClient } from './utils';
import {
  mapApiMethod
} from './api_map';
import db from '../../../db';

const refreshAccessToken = (authData, user) => {
	return new Promise((resolve, reject) => {
		const now = new Date().getTime() / 1000;
		const expires_in = authData.expires_in - 30; // 30 seconds margin of error
		const ts_last_token = authData.ts_last_token;
		const client = createClient();
		const userId = user ? user.userId : null;
		let accessToken;

		if ((now - ts_last_token > expires_in) && user) {
			client.app.accessTokenFromRefreshToken(authData.refresh_token)
				.then((response) => {
					accessToken = response.access_token;
					// T_TODO
					// Update service in our database
					// This shouldn't be done here ;)
					// No operations to our database should be allowed from the services
					var query = r.table('users').get(userId)
						.update({services: r.row('services')
							.map((service) => {
								return r.branch(
									service('authData')('access_token').eq(authData.access_token),
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
				.then(() => {
					resolve(accessToken);
				})
				.catch((error) => {
					reject(error);
				})
		} else {
			resolve(authData.access_token);
		}
	});
}

const request = ({ authData, method, params, user }, callback) => {
  const client = createClient();

  refreshAccessToken(authData, user)
    .then((credentials) => {
      let asanaPromise;
      client.useOauth({ credentials });

      const asanaMethod = mapApiMethod(method, client);

      // T_TODO We have to return null if the method don't exist
      if (!asanaMethod) {
        return Promise.reject(new SwipesError('asana_sdk_not_supported_method'));
      }

      let id = null;

      if (params.id) {
        id = params.id;
        delete(params.id);
      }

      if (id) {
        asanaPromise = asanaMethod(id, params);
      } else if (method === 'webhooks.create') {
        asanaPromise = asanaMethod(params.resource, params.target);
      } else if (method === 'events.get') {
        asanaPromise = asanaMethod(params.resource, params.sync);
      } else {
        asanaPromise = asanaMethod(params);
      }

      return asanaPromise;
    })
    .then((response) => {
      // For some reason sometimes the response is without .data
      // In the web explorer where one can test the api
      // there is no such problem.
      // When we delete things there is no response at all...
      var data = {};

      if (response) {
        // Absolutely ugly patch. I should return always the whole result back
        if (response.sync) {
          data = response;
        } else {
          data = response.data || response;
        }
      }

      callback(null, data);
    })
    .catch((error) => {
      callback(error);
    })
}

const shareRequest = ({ authData, type, itemId, user }, callback) => {
  let method = '';
  let params = {};

  if (type === 'story') {
    method = 'tasks.findById';
    params = Object.assign({}, {
      id: itemId,
      opt_expand: 'assignee'
    })
  } else {
    return callback('This type is not supported :/');
  }

  request({authData, method, params, user }, (err, res) => {
    if (err) {
      return callback(err);
    }

    const serviceActions = cardActions(type, res);
    const serviceData = cardData(type, res);
    const meta = Object.assign({}, serviceData, serviceActions);

    return callback(null, { meta });
  })
}

const cardData = (type, data) => {
  let mappedData;
  let subtitle = null;
  let photo = null;

  if (data.projects.length > 0) {
    subtitle = [];
    data.projects.forEach((project) => {
      subtitle.push(project.name);
    })

    subtitle = subtitle.join('/');
  }

  if (data.assignee && data.assignee.photo) {
    photo = data.assignee.photo;
  }

  if (type === 'story') {
    mappedData = {
      title: data.name || '',
      subtitle,
      photo
    }
  }

  return mappedData;
}

const cardActions = (type, data) => {
  // Dummy for now
  return [];
}

export {
  request,
  shareRequest
}
