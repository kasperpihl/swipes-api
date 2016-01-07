"use strict";


let express = require( 'express' );
let router = express.Router();
let r = require('rethinkdb');
let db = require('../db.js');
let util = require('../util.js');
let generateId = util.generateSlackLikeId;
let serviceDir = __dirname + '/../../services/';

router.post('/services.list', (req, res, next) => {

});

router.post('/services.call', (req, res, next) => {

});

router.post('/services.authorize', (req, res, next) => {

});

router.post('/services.install', (req, res, next) => {
	let isAdmin = req.isAdmin;
	console.log('hit the request');
	if (!isAdmin) {
		return res.status(200).json({ok: false, err: 'not_admin'});
	}

	let folderName = req.body && req.body.folder_name;

	if (!folderName) {
		return res.status(200).json({ok: false, err: 'folder_name_required'});
	}

	let getAppQ = r.table('services').filter((app) => {
		return app('folder_name').eq(folderName)
	});


	db.rethinkQuery(getAppQ).then((foundService) => {
		if(foundService instanceof Array){
			if(foundService.length){
				return new Promise((resolve, reject) =>{ reject('service_already_installed') });
			}
		}

		let manifest = JSON.parse(util.getAppFile(serviceDir + folderName + '/manifest.json'));
		if(!manifest){
			return new Promise((resolve, reject) =>{ reject('no_manifest_found') });
		}
		let updateObj = {
			id: generateId('S'),
			title: manifest.title,
			manifest_id: manifest.identifier,
			folder_name: folderName,
			version: manifest.version,
			description: manifest.description
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