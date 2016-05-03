"use strict";

let serviceDir = __dirname + '/../../services/';
let r = require('rethinkdb');
let db = require('../db.js');
let util = require('../util.js');
let SwipesError = require('../swipes-error.js');

let generateId = util.generateSlackLikeId;
let serviceUtil = {};

serviceUtil.validateData = (req, res, next) => {
	let data = req.body.data;

	if (!data) {
		return next(new SwipesError('data_required'));
	}

	// Some additional information
	data.userId = req.userId;

	res.locals.data = data;

	return next();
}

serviceUtil.getServiceWithAuth = (req, res, next) => {
	let service = req.body.service;

	if (!service) {
		return next(new SwipesError('service_required'));
	}

	//T_TODO fix this query. Possible for multiple accounts - filtering by id
	// merging information from right to left. User's information is more
	// important is this case
	let userServiceQ = r.table("users")
						.get(req.userId)("services")
						.default([])
						.filter({"service_name": service})
						.limit(1)
						.pluck('authData', 'service_id', 'id', 'service_name') // Add user settings here
						.eqJoin('service_id', r.table('services'), {index: 'id'})
						.without([{right:'id'}, {right:'title'}])
						.zip()

	db.rethinkQuery(userServiceQ)
		.then((foundService) => {
			// If the service didn't exist in the database
			if (!(foundService instanceof Array) || !foundService.length) {
				return next(new SwipesError('service_not_authed'));
			}

			res.locals.service = foundService[0];

			return next();
		}).catch((err) => {
			return next(err);
		});
}

serviceUtil.getService = (req, res, next) => {
	// Kasper how should I know that service is manifest_id ??? Keep it consistent.
	let manifestId = req.body.service;

	if (!manifestId) {
		manifestId = req.query.service;
	}
	if (!manifestId) {
		return next('service_required!');
	}

	let getServiceQ =
		r.table('services')
			.getAll(manifestId, {index: 'manifest_id'})
			.nth(0)
			.default(null);

	db.rethinkQuery(getServiceQ)
		.then((service) => {
			if (!service) {
				return next('service_not_found');
			}

			res.locals.service = service;

			return next();
		})
		.catch((err) => {
			return next(err);
		})
}

serviceUtil.requireService = (req, res, next) => {
	let service = res.locals.service;
	let file;

	try {
		file = require(serviceDir + service.folder_name + '/' + service.script);
	}
	catch (e) {
		console.log(e);
		return next(e);
	}

	res.locals.file = file;

	return next();
}

serviceUtil.getAuthData = (req, res, next) => {
	let data = res.locals.data;
	let service = res.locals.service;
	let file = res.locals.file;

	if (typeof file.beforeAuthSave === 'function') {
		file.beforeAuthSave(data, (err, result) => {
			if (err) {
				return next(err);
			}

			let authData = result;

			// To allow multiple accounts, each account should provide unique id so we don't get double auth from an account
			if (!authData.uniq_id) {
				// If no id is provided (or no handler was set), use the service id. Multiple accounts won't work then.
				authData.uniq_id = service.id;
			}
			console.log('authData', authData);
			let serviceToAppend = {
				id: authData.uniq_id,
				service_id: service.id,
				service_name: service.manifest_id,
				authData: authData
			};
			if(authData.show_name){
				serviceToAppend.show_name = authData.show_name;
				delete serviceToAppend.authData.show_name;
			}

			delete serviceToAppend.authData.uniq_id;

			res.locals.serviceToAppend = serviceToAppend;

			return next();
		});
	}
}

serviceUtil.updateAuthData = (req, res, next) => {
	// T_TODO: if(service_id  === authData.service_id && id === authData.id)
	// Remove it before inserting the new one (or replace etc.)
	// This will both allow multi accounts and prevents duplicate accounts
	let userId = req.userId;
	let serviceToAppend = res.locals.serviceToAppend;
	let query = r.table('users').get(userId).update((user) => {
		return {
			services: user('services').default([]).append(serviceToAppend)
		}
	});

	db.rethinkQuery(query)
		.then(() => {
			return res.status(200).json({ok: true, res: serviceToAppend});
		})
		.catch((err) => {
			return next(err);
		});
}

serviceUtil.saveAuthDataToUser = (authData, userId) => {
	// T_TODO: if(service_id  === authData.service_id && id === authData.id)
	// Remove it before inserting the new one (or replace etc.)
	// This will both allow multi accounts and prevents duplicate accounts
	let query = r.table('users').get(userId).update((user) => {
		return {
			services: user('services').default([]).append(authData)
		}
	})
	return db.rethinkQuery(query);
};

module.exports = serviceUtil;
