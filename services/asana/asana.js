"use strict";

import config from 'config';
import util from 'util';
import Asana from 'asana';
import Promise from 'bluebird';
import r from 'rethinkdb';
import db from '../../rest/db.js'; // T_TODO I should make this one a local npm module
import SwipesError from '../../rest/swipes-error';
import {
	createSwipesShortUrl
} from '../../rest/utils/share_url_util.js';
import {
	unsubscribeFromAll,
	subscribeToAll
} from './webhooks';
import {
	updateCursors,
	insertEvent
} from '../../rest/utils/webhook_util.js';

const asanaConfig = config.get('asana');

const createClient = () => {
	const {
		clientId,
		clientSecret,
		redirectUri
	} = asanaConfig;

	return Asana.Client.create({ clientId, clientSecret, redirectUri });
}

const getAsanaApiMethod = (method, client) => {
	const arr = method.split('.');
	const len = arr.length;
	let asanaMethod = client;
	let prevAsanaMethod = asanaMethod;

	for (let i=0; i<len; i++) {
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

const processChanges = (userId, events, accountId) => {
	// Care only for .tag 'file' just for simplicity
	const filteredEvents = events.filter((event) => {
		return event['type'] === 'story' && event['action'] !== 'removed';
	});

	filteredEvents.forEach((event) => {
		createShortUrl(userId, event, accountId);
	})
}

const createShortUrl = (userId, event, accountId) => {
	if (event.parent) {
		const service = {
			name: 'asana',
			account_id: event.user.id,
			type: 'task',
			item_id: event.parent.id
		}

		createSwipesShortUrl({ userId, service })
			.then((shortUrl) => {
				createEvent(userId, event, accountId, shortUrl);
			})
			.catch((err) => {
				console.log('Failed creating short url for an asana event', err);
			})
	} else {
		createEvent(userId, event, accountId);
	}
}

const createEvent = (userId, event, accountId, shortUrl = null) => {
	const createdBy = event.resource.created_by.name;
	const me = event.user.id === accountId;
	let text;

	if (event.resource.type === 'comment') {
		text = createdBy + ' commented ' + event.resource.text;
	} else {
		text = createdBy + ' ' + event.resource.text;
	}

	const eventData = {
		service: 'asana',
		message: text,
		shortUrl: shortUrl,
		me
	}

	insertEvent({
		userId,
		eventData
	});
}

const asana = {
	request({ authData, method, params, user }, callback) {
		const client = createClient();

		refreshAccessToken(authData, user)
			.then((credentials) => {
				let asanaPromise;
				client.useOauth({ credentials });

				const asanaMethod = getAsanaApiMethod(method, client);

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
	},
	shareRequest({ authData, type, itemId, user }, callback) {
		let method = '';
		let params = {};

		if (type === 'task') {
			method = 'tasks.findById';
			params = Object.assign({}, {
				id: itemId,
				opt_expand: 'assignee'
			})
		} else {
			return callback('This type is not supported :/');
		}

		asana.request({authData, method, params, user }, (err, res) => {
			if (err) {
				return callback(err);
			}

			const serviceActions = asana.cardActions(type, res);
			const serviceData = asana.cardData(type, res);

			return callback(null,  { serviceData, serviceActions });
		})
	},
	cardData(type, data) {
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

		if (type === 'task') {
			mappedData = {
				title: data.name || '',
				subtitle,
				photo
			}
		}

		return mappedData;
	},
	cardActions(type, data) {
		const actions = [];

		// if (type === 'task') {
		// 	if (!data.completed) {
		// 		actions.push({
		// 			label: 'Complete',
		// 			icon: 'check',
		// 			bgColor: 'green',
		// 			method: 'tasks.update',
		// 			data: {
		// 				id: data.id,
		// 				completed: true
		// 			}
		// 		})
		// 	} else {
		// 		actions.push({
		// 			label: 'Undo',
		// 			icon: 'check',
		// 			bgColor: 'gray',
		// 			method: 'tasks.update',
		// 			data: {
		// 				id: data.id,
		// 				completed: false
		// 			}
		// 		})
		// 	}
		// }

		return actions;
	},
	processWebhook(account, resourceId, accountId, callback) {
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

			const errors = result.errors;
			const data = result.data;

			const sync = result.sync;

			processChanges(user_id, data, accountId);

			// Repeat until there is no more pages
			if (data && data.length > 0) {
				Object.assign(params, { sync });

				this.request({ authData, method, params, user }, secondCallback);
			} else {
				const cursors = {
					[cursorId]: sync
				}

				updateCursors({ userId, accountId, cursors });
			}
		}

		this.request({ authData, method, params, user }, secondCallback);
	},
	beforeAuthSave(data, callback) {
		const client = createClient();
		const code = data.code;
		const userId = data.userId;
		let authData, id, show_name;

		client.app.accessTokenFromCode(code)
			.then((response) => {
				authData = response;
				id = response.data.id;
				show_name = response.data.email;
				// Need that for the refresh token
				response.ts_last_token = new Date().getTime() / 1000;

				data = { authData, id, show_name };

				return unsubscribeFromAll({ asana, authData, userId });
			})
			.then(() => {
				subscribeToAll({ asana, authData, userId, accountId: id });

				callback(null, data);
			})
			.catch((error) => {
				console.log(error);
				callback(error);
			})
	},
	authorize(data, callback) {
		const client = createClient();
		const url = client.app.asanaAuthorizeUrl();

		callback(null, {
			type: 'oauth',
			url: url
		});
	}
};

module.exports = asana;
