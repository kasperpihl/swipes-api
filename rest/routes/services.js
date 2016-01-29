"use strict";

let SwipesError = require( '../swipes-error' );
let express = require( 'express' );
let router = express.Router();
let r = require('rethinkdb');
let db = require('../db.js');
let util = require('../util.js');
let generateId = util.generateSlackLikeId;
let serviceDir = __dirname + '/../../services/';
let serviceUtil = require('../utils/services_util.js');

let isAdmin = util.isAdmin;

router.post('/services.request', serviceUtil.validateData, serviceUtil.getServiceWithAuth, serviceUtil.requireService, (req, res, next) => {
	let data = res.locals.data;
	let service = res.locals.service;
	let file = res.locals.file;

	file.request(service.authData, data.method, data.parameters, function (err, result) {
		if (err) {
			return next(err);
		}

		res.send({ok: true, data: result});
	});
});

/*
	authsuccess should be called after
*/

router.post('/services.authsuccess', serviceUtil.validateData, serviceUtil.getService, serviceUtil.requireService, serviceUtil.getAuthData, serviceUtil.updateAuthData);

router.post('/services.authorize', serviceUtil.getService, serviceUtil.requireService, (req, res, next) => {
	let service = res.locals.service;
	let file = res.locals.file;

	if(typeof file.authorize !== 'function') {
		return next(new SwipesError('authorize_function_not_found'));
	}

	file.authorize({userId: req.userId}, (error, result) => {
		if (error) {
			return next(error);
		}

		return res.status(200).json({ok: true, result: result});
	});
});

/*
	This is for sysadmin only!
*/
router.post('/services.install', isAdmin, (req, res, next) => {
	console.log('service');
	let manifestId = req.body && req.body.manifest_id;

	if (!manifestId) {
		return res.status(200).json({ok: false, err: 'manifest_id is required'});
	}

	let getServiceQ =
		r.table('services')
			.getAll(manifestId, {index: 'manifest_id'})
			.nth(0)
			.default(null);

	db.rethinkQuery(getServiceQ).then((service) => {
		let serviceId;

		if (service) {
			serviceId = service.id;
		} else {
			serviceId = generateId('S');
		}

		let manifest = JSON.parse(util.getFile(serviceDir + manifestId + '/manifest.json'));

		if (!manifest) {
			return Promise.reject({ok: false, err: 'no_manifest_found'});
		}

		let updateObj = {
			id: serviceId,
			title: manifest.title,
			manifest_id: manifest.identifier,
			folder_name: manifest.identifier,
			version: manifest.version,
			description: manifest.description,
			script: manifest.script
		}

		return db.rethinkQuery(r.table('services').insert(updateObj, {'conflict': 'update'}));
	}).then(() => {
		return res.status(200).json({ok: true});
	}).catch((err) => {
		if (err.ok === false) {
			return res.status(200).json(err);
		}

		return next(err);
	});
});


module.exports = router;
