"use strict";

let serviceDir = __dirname + '/../../services/';
let r = require('rethinkdb');
let db = require('../db.js');
let util = require('../util.js');
let generateId = util.generateSlackLikeId;

let serviceUtil = {};

serviceUtil.getDataFromReq = (req) => {
	let data = req.body.data;
	if (!data) {
		return Promise.reject('data_required');
	}
	return Promise.resolve(data);
}

serviceUtil.getServiceFromReq = (req) => {
	let service = req.body.service;
	if (!service) {
		return Promise.reject('service_required');
	}

	let getServiceQ = r.table('services').filter((ser) => {
		return ser('manifest_id').eq(service);
	});
	
	return new Promise(function(resolve, reject){
		db.rethinkQuery(getServiceQ).then((foundService) => {
			// If the service didn't exist in the database
			if(!(foundService instanceof Array) || !foundService.length){
				return reject('service_not_found');
			}
			resolve(foundService[0]);
		});
	})
};

serviceUtil.getScriptFileFromServiceObj = (service) => {
	let scriptFile;
	try{
		scriptFile = require(serviceDir + service.folder_name + '/' + service.script);
	}
	catch(e){
		return Promise.reject('script_not_found');
	}

	return Promise.resolve(scriptFile);
};

serviceUtil.getAuthDataToSaveForScriptFileAndData = (scriptFile, data) => {
	if(typeof scriptFile.beforeAuthSave === 'function'){
		return new Promise((resolve, reject) => {
			scriptFile.beforeAuthSave(data, (err, res) => {
				if(!err){
					resolve(res);
				}
				else{
					console.log('error is here', err);
					reject(err);
				}
			});
		});
	}

	return Promise.resolve(data);
};

serviceUtil.saveAuthDataToUser = (authData, userId) => {
	// FUTURE T_TODO: if user exist, replace? We need some kind of identification from each account to not duplicate
	let query = r.table('users').get(userId).update((user) => {
		return {
			services: user('services').default([]).append(authData)
		}
	})
	return db.rethinkQuery(query);
};

module.exports = serviceUtil;