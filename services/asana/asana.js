import config from 'config';
import Asana from 'asana';
import Promise from 'bluebird';
import r from 'rethinkdb';
import db from '../../rest/db.js'; // T_TODO I should make this one a local npm module
import SwipesError from '../../rest/swipes-error';
import { subscribeToAllProjects } from './webhooks';

const webhooksHost = config.get('webhooksHost');
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
		const userId = user.userId;
		let accessToken;

		if (now - ts_last_token > expires_in) {
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
					data = response.data || response;
				}

				callback(null, data);
			})
			.catch((error) => {
				callback(error);
			})
	},
	shareRequest({ authData, type, params, user }, callback) {
		let method = '';

		if (type === 'task') {
			method = 'tasks.findById'
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

		if (type === 'task') {
			mappedData = {
				title: data.name || ''
			}
		}

		return mappedData;
	},
	cardActions(type, data) {
		const actions = [];

		if (type === 'task') {
			if (!data.completed) {
				actions.push({
					label: 'Complete',
					icon: 'check',
					bgColor: 'green',
					method: 'tasks.update',
					data: {
						id: data.id,
						completed: true
					}
				})
			} else {
				actions.push({
					label: 'Undo',
					icon: 'check',
					bgColor: 'gray',
					method: 'tasks.update',
					data: {
						id: data.id,
						completed: false
					}
				})
			}
		}

		return actions;
	},
	beforeAuthSave(data, callback) {
		const client = createClient();
		const code = data.code;

		client.app.accessTokenFromCode(code)
			.then((response) => {
				const authData = response;
				const { id, email: show_name } = response.data;
				// Need that for the refresh token
				response.ts_last_token = new Date().getTime() / 1000;

				const data = { authData, id, show_name };

				// T_TODO what if that thing fails miserably?
				subscribeToAllProjects(authData);

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

// T_TODO for some reason export { asana } does not work here
module.exports = asana;
