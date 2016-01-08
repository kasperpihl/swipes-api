"use strict";


let express = require( 'express' );
let router = express.Router();
let r = require('rethinkdb');
let db = require('../db.js');
let util = require('../util.js');
let generateId = util.generateSlackLikeId;
let serviceDir = __dirname + '/../../services/';
let serviceUtil = require('../utils/services_util.js');
router.post('/services.list', (req, res, next) => {

});

router.post('/services.request', (req, res, next) => {
	let data, service;
	// Validate params service and data
	Promise.all([ 
		serviceUtil.getServiceFromReq(req),
		serviceUtil.getDataFromReq(req)
		
	]).then((arr, ex) => {
		service = arr[0];
		data = arr[1];
		
		return serviceUtil.getScriptFileFromServiceObj(service);
	
	}).then((scriptFile) => {

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

		return serviceUtil.getAuthDataToSaveForScriptFileAndData(scriptFile, data);

	}).then((authData) => {

		if(!authData.id){
			return Promise.reject('beforeAuthSave:id_must_be_provided');
		}
		
		saveObj = {
			id: authData.id,
			service_id: service.id,
			service_name: service.manifest_id,
			authData: authData
		};
		delete saveObj.auth.id;

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

router.post('/services.authorize', (req, res, next) => {
	let service;
	serviceUtil.getServiceFromReq(req).then((ser) => {
		service = ser;
		return serviceUtil.getScriptFileFromServiceObj(ser);
	}).then((scriptFile) => {

		if(typeof scriptFile.authorize !== 'function'){
			return Promise.reject('authorize_function_not_found');
		}

		// K_TODO: make this dynamically for obvious reasons
		var authObj = scriptFile.authorize();
		res.send({
			ok:true,
			auth: authObj
		});

	}).catch((err) => {
		if(typeof err === "string"){
			return res.status(200).json({ok: false, err: err});
		}
		return next(err);
	});
});

router.post('/services.install', (req, res, next) => {
	let serviceName;
	util.requireAdminFromReq(req).then(() => {
		serviceName = req.body && req.body.service;
		if (!serviceName) {
			return Promise.reject('service_required');
		}

		let getServiceQ = r.table('services').filter((ser) => {
			return ser('manifest_id').eq(serviceName)
		});
		return db.rethinkQuery(getServiceQ);
	}).then((foundService) => {
		let idForService = generateId('S');
		if(foundService instanceof Array){
			if(foundService.length){
				idForService = foundService[0].id;
			}
		}

		let manifest = JSON.parse(util.getAppFile(serviceDir + serviceName + '/manifest.json'));
		if(!manifest){
			return Promise.reject('no_manifest_found');
		}
		
		let updateObj = {
			id: idForService,
			title: manifest.title,
			manifest_id: manifest.identifier,
			folder_name: folderName,
			version: manifest.version,
			description: manifest.description,
			script: manifest.script
		}

		return db.rethinkQuery(r.table('services').insert(updateObj, {'conflict': 'update'}));
	}).then((result) => {

		res.status(200).json({ok: true});
	
	}).catch((err) => {
		if(typeof err === "string"){
			return res.status(200).json({ok: false, err: err});
		}
		return next(err);
	});
});


module.exports = router;