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

router.post('/services.call', (req, res, next) => {

});
/*
	authsuccess should be called after 
 */
router.post('/services.authsuccess', (req, res, next) => {
	let data, service;
	// Validate params service and data
	Promise.all([ 
		serviceUtil.getServiceFromReq(req), 
		serviceUtil.getDataFromReq(req)
		
	]).then((arr) => {
		service = arr[0];
		data = arr[1];

		return serviceUtil.getScriptFileFromServiceObj(service);

	}).then((scriptFile) => {
		
		return serviceUtil.getAuthDataToSaveForServiceAndData(scriptFile, service, data);

	}).then((authData) => {

		return serviceUtil.saveAuthDataToUserForService(authData, req.userId, service);

	}).then((result) => {

		res.send({ok:true, res: result});

	}).catch((err) => {
		if(typeof err === "string"){
			return res.status(200).json({ok: false, err: err});
		}
		return next(err);
	});

});

router.post('/services.authorize', (req, res, next) => {
	serviceUtil.getServiceFromReq(req).then((service) => {
		
		return serviceUtil.getScriptFileFromServiceObj(service);
	}).then((scriptFile) => {

		if(typeof scriptFile.authorize !== 'function'){
			return Promise.reject('authorize_function_not_found');
		}
		var authObj = scriptFile.authorize({
			redirect_uri: 'http://dev.swipesapp.com/oauth-success.html',
			client_id: '2345135970.9201204242'
		});
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
	let isAdmin = req.isAdmin;
	if (!isAdmin) {
		return res.status(200).json({ok: false, err: 'not_admin'});
	}

	let folderName = req.body && req.body.folder_name;

	if (!folderName) {
		return res.status(200).json({ok: false, err: 'folder_name_required'});
	}

	let getServiceQ = r.table('services').filter((ser) => {
		return ser('folder_name').eq(folderName)
	});

	db.rethinkQuery(getServiceQ).then((foundService) => {
		let idForService = generateId('S');
		if(foundService instanceof Array){
			if(foundService.length){
				idForService = foundService[0].id;
			}
		}

		let manifest = JSON.parse(util.getAppFile(serviceDir + folderName + '/manifest.json'));
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