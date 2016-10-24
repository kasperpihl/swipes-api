"use strict";

import config from 'config';
import request from 'request';
import r from 'rethinkdb';
import mime from 'mime';
import db from '../../rest/db.js'; // T_TODO I should make this one a local npm module
import {
	createSwipesShortUrl
} from '../../rest/utils/share_url_util.js';
import {
	updateCursors,
  insertEvent
} from '../../rest/utils/webhook_util.js';

const serviceDir = __dirname;
const dropboxConfig = config.get('dropbox');

const camelCaseToUnderscore = (word) => {
	// http://stackoverflow.com/questions/30521224/javascript-convert-camel-case-to-underscore-case
	return word.replace(/([A-Z]+)/g, (x,y) => {return "_" + y.toLowerCase()}).replace(/^_/, "");
}

const getDropboxApiMethod = (method) => {
	const pathItems = method.split('.');
	let path = '';

	pathItems.forEach((item) => {
		path = path + '/' + camelCaseToUnderscore(item);
	})

	return path;
}

const dropbox = {
	request({authData, method, params}, callback) {
		const mappedMethod = getDropboxApiMethod(method);
		const headers = {
			Authorization: 'Bearer ' + authData.access_token
		}
		const options = {
			method: 'post',
			json: true
		}

		if (method === 'files.getThumbnail') {
			const apiUrl = 'https://content.dropboxapi.com/2';
			headers['Dropbox-API-Arg'] = JSON.stringify(params);
			options.url = apiUrl + mappedMethod;
			options.encoding = null;
		} else {
			const apiUrl = 'https://api.dropboxapi.com/2';
			options.url = apiUrl + mappedMethod;
			headers['Content-Type'] = 'application/json';
			options.body = params;
		}

		options.headers = headers;

		request(options, (err, res, body) => {
		  if (err) {
		    console.log(err);
				return callback(err);
		  }

			return callback(null, body);
		});
	},
	processWebhook(account, callback) {
		const authData = account.authData;
		const accountId = account.id;
		const userId = account.user_id;
		const method = 'files.listFolder.continue';
		const cursors = account.cursors;

		if (!cursors || !cursors.list_folder_cursor) {
			return callback('The required cursor is missing. Try reauthorize the service to fix the problem.');
		}

		const params = {
			cursor: cursors.list_folder_cursor
		};

		const secondCallback = (error, result) => {
			if (error) {
				return console.log(error);
			}

			const cursor = result.cursor;

			processChanges({account, result});

			// Repeat until there is no more pages
			if (result.has_more) {
				Object.assign(params, {cursor});

				this.request({authData, method, params}, secondCallback);
			} else {
				const cursors = {list_folder_cursor: cursor};
				updateCursors({ userId, accountId, cursors });
			}
		}

		this.request({authData, method, params}, secondCallback);
	},
	shareRequest({ authData, type, itemId, user }, callback) {
		let method = '';
		let params = {};

		if (type === 'file') {
			method = 'files.getMetadata';
			params = Object.assign({}, {
				path: itemId
			})
		} else {
			return callback('This type is not supported :/');
		}

		dropbox.request({authData, method, params, user }, (err, res) => {
			if (err) {
				return callback(err);
			}

			const serviceActions = dropbox.cardActions(type, res);
			const serviceData = dropbox.cardData(type, res);
			const meta = Object.assign({}, serviceData, serviceActions);
			const method = 'files.getThumbnail';
			const params = {
				path: 'rev:' + meta.rev,
				size: 'w128h128'
			};

			dropbox.request({authData, method, params, user }, (err, res) => {
				if (err) {
					return callback(err);
				}

				// That means that we db don't support thumbnail on this file
				if (res.error) {
					return callback(null, { meta });
				}

				const thumbnail = new Buffer(res).toString('base64');
				meta.thumbnail = thumbnail;

				return callback(null, { meta });
			})
		})
	},
	previewRequest({ authData, type, itemId, user }, callback) {
		return callback(null, {});
	},
	cardData(type, data) {
		let mappedData;

		if (type === 'file') {
			let subtitle = data.path_display || '';

			if (subtitle.length > 0) {
				subtitle = subtitle.split('/').slice(0, -1).join('/');
			}

			const mimeType = mime.lookup(data.name);

			mappedData = {
				title: data.name || '',
				mime_type: mimeType || '',
				rev: data.rev,
				subtitle
			}
		}

		return mappedData;
	},
	cardActions(type, data) {
		// Dummy for now
		return [];
	},
	beforeAuthSave(data, callback) {
		const options = {
			method: 'post',
			form: {
				code: data.code,
				grant_type: 'authorization_code',
				client_id: dropboxConfig.appId,
				client_secret: dropboxConfig.appSecret,
				redirect_uri: dropboxConfig.redirectURI
			},
			url: 'https://api.dropboxapi.com/oauth2/token'
		}

		request(options, (err, res, body) => {
			if (err) {
				console.log(err);
			}

			const jsonBody = JSON.parse(body);
			const {
				account_id,
				access_token,
				token_type
			} = jsonBody;
			const authData = { access_token, token_type };
			const method = 'users.getAccount';
			const params = { account_id };
			const data = { authData, id: account_id };
			const cursors = {};

			this.request({authData, method, params}, (err, res) => {
				if (err) {
					console.log(err);
				}

				data.show_name = res.email;

				const method = 'files.listFolder.getLatestCursor';
				const params = {
					path: '',
					recursive: true
				}

				this.request({authData, method, params}, (err, res) => {
					if (err) {
						console.log(err);
					}

					cursors['list_folder_cursor'] = res.cursor;
					data.cursors = cursors;

					return callback(null, data);
				});
			})
		})
	},
	authorize(data, callback) {
    let url = 'https://www.dropbox.com/oauth2/authorize';
    url += '?response_type=code'
		url += '&client_id=' + dropboxConfig.appId;
		url += '&redirect_uri=' + dropboxConfig.redirectURI;
		// T_TODO state for better security

		callback(null, {type: 'oauth', url: url});
	}
};

const processChanges = ({account, result}) => {
	const entries = result.entries;
	// Care only for .tag 'file' just for simplicity
	const filteredEntries = entries.filter((entry) => {
		return entry['.tag'] === 'file' && entry.sharing_info;
	});

	filteredEntries.forEach((entry) => {
		processFileChange({account, entry});
	})
}

const processFileChange = ({account, entry}) => {
	const authData = account.authData;
	const userId = account.user_id;
	const accountId = account.id;

	// Get which user modified the file
	const getAccountMethod = 'users.getAccount';
	const getAccountParams = {
		account_id: entry.sharing_info.modified_by
	}

	dropbox.request({authData, method: getAccountMethod, params: getAccountParams}, (err, res) => {
		if (err) {
			console.log(err);
			return;
		};

		const user = res;
		const sameUser = accountId === user.account_id;
		const userName = sameUser ? 'You' : user.name.display_name || user.email;
		//const userProfilePic = user.profile_photo_url || '';
		const message = userName + ' made a change';

		const link = {
			service: 'dropbox',
			type: 'file',
			id: 'rev:' + entry.rev
		};

		createSwipesShortUrl({ userId, accountId, link })
			.then(({ meta, checksum }) => {
				const event = {
					service: 'dropbox',
					message: message,
					meta: meta,
					account_id: accountId,
					me: sameUser,
					checksum
				}

				insertEvent({
					userId: userId,
					eventData: event
				});
			})
			.catch((err) => {
				console.log('Failed creating short url for an dropbox event', err);
			})
	})
}

module.exports = dropbox;
