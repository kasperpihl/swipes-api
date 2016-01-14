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

router.post('/services.request', (req, res, next) => {
	let data, service;
	// Validate params service and data
	Promise.all([
		serviceUtil.getDataFromReq(req),
		serviceUtil.getServiceWithAuthFromReq(req)
	]).then((arr, ex) => {
		data = arr[0];
		service = arr[1];

		return serviceUtil.getScriptFileFromServiceObj(service);

	}).then((scriptFile) => {
		if(typeof scriptFile.request !== 'function'){
			return Promise.reject('request_function_not_found');
		}
		return new Promise((resolve, reject) => {
			scriptFile.request(service.authData, data.method, data.parameters, function(err, result){
				if(!err){
					return resolve(result);
				}
				else{
					// K_TODO: Make smart error handling from API
					return reject(err);
				}

			});
		})

	}).then((result) => {
		res.send(result);
	}).catch((err) => {
		if(typeof err === "string"){
			return res.status(200).json({ok: false, err: err});
		}
		return next(err);
	});
});

/*
	authsuccess should be called after
*/

router.post('/services.authsuccess', (req, res, next) => {
	let data, service, saveObj;
	// Validate params service and data
	Promise.all([
		serviceUtil.getServiceFromReq(req),
		serviceUtil.getDataFromReq(req)

	]).then((arr, ex) => {
		service = arr[0];
		data = arr[1];

		return serviceUtil.getScriptFileFromServiceObj(service);

	}).then((scriptFile) => {
		// T_TODO Hack to get this working.. Kasper will be proud with me
		data.userId = req.userId;
		return serviceUtil.getAuthDataToSaveForScriptFileAndData(scriptFile, data);

	}).then((authData) => {

		// To allow multiple accounts, each account should provide unique id so we don't get double auth from an account
		if(!authData.id){
			// If no id is provided (or no handler was set), use the service id. Multiple accounts won't work then.
			authData.id = service.id;
		}
		console.log('authData', authData);
		saveObj = {
			id: authData.id,
			service_id: service.id,
			service_name: service.manifest_id,
			authData: authData
		};
		delete saveObj.authData.id;

		return serviceUtil.saveAuthDataToUser(saveObj, req.userId);

	}).then((result) => {

		res.send({ok:true, res: saveObj});

	// Error handler
	}).catch((err) => {
		if(typeof err === "string"){
			return res.status(200).json({ok: false, err: err});
		}
		return next(err);
	});

});

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

		res.locals.response = result;

		return next();
	});
});

/*
	This is for sysadmin only!
*/
router.post('/services.install', isAdmin, (req, res, next) => {
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

		let manifest = JSON.parse(util.getAppFile(serviceDir + manifestId + '/manifest.json'));

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
