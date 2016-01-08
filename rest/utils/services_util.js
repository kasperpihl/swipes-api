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

serviceUtil.getMethodFromReq = (req) => {
	let method = req.body.method;
	if (!method) {
		return Promise.reject('method_required');
	}
	if(typeof method !== 'string'){
		return Promise.reject('method_must_be_string');
	}
	return Promise.resolve(method);
}

// Get service object from a user including the auth data
serviceUtil.getServiceWithAuthFromReq = (req) => {
	let service = req.body.service;
	if (!service) {
		return Promise.reject('service_required');
	}
	// Query the users services for auths that fit the current service and join with the service object
	let userServiceQ = r.table("users")
						.get(req.userId)("services")
						.filter({"service_name":service})
						.limit(1)
						.pluck('authData', 'service_id') //  // Add user settings here
						.eqJoin('service_id', r.table('services'), {index: 'id'})
						.without([{left:'service_id'}])
						.zip()
	return new Promise(function(resolve, reject){
		db.rethinkQuery(userServiceQ).then((foundService) => {
			// If the service didn't exist in the database
			if(!(foundService instanceof Array) || !foundService.length){
				return reject('service_not_authed');
			}
			resolve(foundService[0]);
		});
	})

};


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