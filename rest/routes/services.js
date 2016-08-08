"use strict";

import stream from 'stream';
import express from 'express';
import r from 'rethinkdb';
import db from '../db.js';
import util from '../util.js';
import serviceUtil from '../utils/services_util.js';
import SwipesError from '../swipes-error';
import {
	xendoSwipesCredentials,
	xendoRefreshSwipesToken,
	xendoAddServiceToUser
} from '../middlewares/xendo.js';

const router = express.Router();
const serviceDir = __dirname + '/../../services/';
const isAdmin = util.isAdmin;
const generateId = util.generateSlackLikeId;

router.post('/services.request',
	serviceUtil.validateData,
	serviceUtil.getServiceWithAuth,
	serviceUtil.requireService,
	(req, res, next) => {
		const data = res.locals.data;
		const service = res.locals.service;
		const file = res.locals.file;
		const options = {
			authData: service.authData,
			method: data.method,
			params: data.parameters,
			user: {userId: req.userId},
			service: {serviceId: service.id}
		};
		file.request(options, function (err, result) {
			if (err) {
				return res.status(200).json({ok:false, err: err});
			}

			res.send({ok: true, data: result});
		});
	}
);

router.post('/services.search',
	serviceUtil.validateData,
	serviceUtil.getServiceWithAuth,
	serviceUtil.requireService,
	(req, res, next) => {
		const data = res.locals.data;
		const service = res.locals.service;
		const file = res.locals.file;
		const options = {
			authData: service.authData,
			params: data,
			user: {userId: req.userId},
			service: {serviceId: service.id}
		};
		file.search(options, function (err, result) {
			if (err) {
				return res.status(200).json({ok:false, err: err});
			}

			res.send({ok: true, data: result});
		});
	}
);

router.post('/services.stream',
	serviceUtil.validateData,
	serviceUtil.getServiceWithAuth,
	serviceUtil.requireService,
	(req, res, next) => {
		const data = res.locals.data;
		const service = res.locals.service;
		const file = res.locals.file;
		const options = {
			authData: service.authData,
			method: data.method,
			params: data.parameters || {},
			user: {userId: req.userId},
			service: {serviceId: service.id}
		};
		const passStream = new stream.PassThrough();

		file.stream(options, passStream, function (err) {
			if (err) {
				res.status(200).json({ok: false, error: err});
			}
		});

		passStream.pipe(res);
	}
)

/*
	authsuccess should be called after
*/

router.post('/services.authsuccess',
	serviceUtil.validateData,
	serviceUtil.getService,
	serviceUtil.requireService,
	serviceUtil.getAuthData,
	serviceUtil.updateAuthData,
	// xendoSwipesCredentials,
	// xendoRefreshSwipesToken,
	// xendoAddServiceToUser,
	(req, res, next) => {
		return res.status(200).json({ok: true});
	}
);

/*
	This is for sysadmin only!
*/
router.post('/services.install', isAdmin, (req, res, next) => {
	console.log('service');
	const manifestId = req.body && req.body.manifest_id;

	if (!manifestId) {
		return res.status(200).json({ok: false, err: 'manifest_id is required'});
	}

	const getServiceQ =
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

		const manifest = JSON.parse(util.getFile(serviceDir + manifestId + '/manifest.json'));

		if (!manifest) {
			return Promise.reject({ok: false, err: 'no_manifest_found'});
		}

		const updateObj = {
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
