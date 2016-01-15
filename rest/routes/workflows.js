"use strict";

let express = require( 'express' );
let router = express.Router();
let Promise = require('bluebird');
let fs = require('fs');
let r = require('rethinkdb');
let config = require('config');
let _ = require('underscore');
let db = require('../db.js');
let jsonToQuery = require('../json_to_query.js').jsonToQuery;
let util = require('../util.js');
let utilDB = require('../util_db.js');
let workflowUtil = require('../utils/workflows_util.js');

// relative directory to installed apps
let appDir = __dirname + '/../../apps/';
let generateId = util.generateSlackLikeId;

require('rethinkdb-init')(r);
let dbConfig = config.get('database');



router.post('/workflows.install', (req, res, next) => {
  let isAdmin = req.isAdmin;

  if (!isAdmin) {
    return res.status(200).json({ok: false, err: 'not_admin'});
  }

  let appId = req.body && req.body.app_id;
  let manifestId = req.body && req.body.manifest_id;

  if (!appId && !manifestId) {
    return res.status(200).json({ok: false, err: 'app_id_or_manifest_id_required'});
  }

  let getAppQ;

  if (appId) {
    getAppQ = r.table('apps').get(appId);
  } else {
    // This should always return 0 or 1 result
    getAppQ = r.table('apps').filter((app) => {
      return app('manifest_id').eq(manifestId)
            .and(app.hasFields('deleted').not())
    });
  }

  // Global variables for the manifest and the app
  let app, manifest;

  db.rethinkQuery(getAppQ).then((localApp) => {
    /*
      Validate that we have a manifest, and set proper loaded app if existing
     */


    if(localApp instanceof Array){
      if(localApp.length){
        app = localApp[0];
      }
    }
    else{
      app = localApp;
    }


    if(!manifestId){
      if(app && app.manifest_id)
        manifestId = app.manifest_id;
      else
        return res.status(200).json({ok: false, err: 'no_app_found'});
    }

    manifest = JSON.parse(util.getFile(appDir + manifestId + '/manifest.json'));

    if (!manifest) {
      return res.status(200).json({ok: false, err: 'no_manifest_found'});
    }
    if(!app)
      app = {};
    // Just return a promise to jump to next

    // Find out which tables to install
    var tablesToInstall = [];
    if(manifest.tables){
      if(!app.tables)
        app.tables = [];
      for(var i = 0 ; i < manifest.tables.length ; i++ ){
        var table = manifest.tables[i];
        if(app.tables.indexOf(table.name) === -1){
          table.name = manifestId + '_' + table.name;
          tablesToInstall.push(table);
          app.tables.push(table.name);
        }
      }
    }

    if(tablesToInstall.length){
      console.log("installing tables", tablesToInstall);
      return r.init(dbConfig, tablesToInstall);
    }
    else {
      console.log("no tables to install");
      return new Promise((resolve) =>{ resolve() });
    }


  }).then((result) => {
    /*
      Tables are now installed
      Prepare apps object to be updated
     */


    let updateObj = {
      id: app.id,
      name: manifest.title,
      manifest_id: manifestId,
      description: manifest.description,
      version: manifest.version,
      is_installed: true
    };
    if(app.tables && app.tables.length){
      updateObj.tables = app.tables;
    }

    if(!updateObj.id)
      updateObj.id = generateId('A');

    if(manifest.main_app)
      updateObj.main_app = manifest.main_app;
    if(manifest.background)
      updateObj.has_background = true;

    console.log("updating app object")

    return db.rethinkQuery(r.table('apps').insert(updateObj, {'conflict': 'update'}));

  }).then((result) => {
    res.status(200).json({ok: true});
  }).catch((err) => {
    return next(err);
  });
});


router.post('/workflows.method', (req, res, next) => {
  let manifestId = req.body.manifest_id;
  let method = req.body.method;
  let data = req.body.data || {};

  workflowUtil.callAppMethod(manifestId, method, data)
    .then((result) => {
      if (result.err) {
        return res.status(200).json({ok: false, err: result.err});
      }

      return res.status(200).json({ok: true, res: result.res});
    })
    .catch((err) => {
      return next(err);
    })
});


router.post('/workflows.saveData', (req, res, next) => {
  let appId = req.body.app_id;
  let queryObject = req.body.query;

  console.log(queryObject);

  let getAppQ = r.table('apps').filter({manifest_id: appId, is_installed: true});
  let handlerTimeout = 3000;
  let tableWithoutPrefix;
  let background;

  db.rethinkQuery(getAppQ).then((apps) => {
    // Run validations for request
    if (!apps.length) {
      return res.status(200).json({ok: false, err: 'app_not_found'});
    }

    let app = apps[0];

    if (!queryObject.table) {
      return res.status(200).json({ok: false, err: 'table_required'});
    }

    tableWithoutPrefix = queryObject.table;

    if (!queryObject.data) {
      return res.status(200).json({ok: false, err: 'data_required'});
    }

    if( typeof queryObject.data !== 'object'){
      return res.status(200).json({ok: false, err: 'data_must_be_array_or_object'});
    }

    let manifest = JSON.parse(util.getFile(appDir + appId + '/manifest.json'));

    if (!manifest) {
      return res.status(200).json({ok: false, err: 'no_manifest_found'});
    }

    // Check if app has background script setup
    if (manifest.background) {
      background = require(appDir + manifest.identifier + "/" + manifest.background);

      if (!background) {
        return res.status(200).json({ok: false, err: 'background_script_not_found'});
      }
    }

    // If data is not an array, create it as array, this is for our loops to work
    if(!(queryObject.data instanceof Array)) {
      queryObject.data = [queryObject.data];
    }

    // Define the beforeHandler function if any exist for current app
    let beforeHandler = (data, callback) => {
      if (background && background.beforeHandlers && background.beforeHandlers[queryObject.table]) {
        // A beforeHandler should call its callback with the data
        let didReturn = false;
        let timer = setTimeout(() =>{
          didReturn = true;
          callback(null, "before_handler_timeout")
        }, handlerTimeout)

        background.beforeHandlers[queryObject.table](data, (error, newData) => {
          clearTimeout(timer);

          if(!didReturn) {
            callback(error, newData);
          }
        })
      }
      else {
        callback(null, data);
      }
    }

    // Define validation function, this will call any beforeHandler, and then validate data from our side
    let validateFunction = (data) => {
      return new Promise((resolve, reject) => {
        beforeHandler(data, function(error, newData){
          if(error){
            return reject(error);
          }

          if(!newData){
            return reject("before_handler_failed");
          }

          if(!newData.scope){
            if(queryObject.scope){
              newData.scope = queryObject.scope;
            }
            else{
              return reject("scope_not_provided");
            }
          }
          console.log("scoping", app, newData.scope);
          if(req.scopes.indexOf(newData.scope) == -1){
            return reject("scope_not_allowed");
          }

          return resolve(newData);
        });

      });
    }

    // Create promises to validate for each objects to save
    let promises = [];

    for (let i = 0 ; i < queryObject.data.length ; i++) {
      promises.push(validateFunction(queryObject.data[i]));
    }

    return Promise.all(promises);
  }).then(dataSet => {
    let tableName = util.appTable(appId, queryObject.table);

    queryObject.table = tableName;
    queryObject.data = dataSet;

    let rethinkQ = jsonToQuery(queryObject, {returnChanges: true});

    return db.rethinkQuery(rethinkQ);
  }).then((result) => {
    let afterHandler = (newData, oldData) => {
      return new Promise((resolve, reject) => {
        if(background && background.afterHandlers && background.afterHandlers[tableWithoutPrefix]) {
          let didReturn = false;
          let timer = setTimeout(() =>{
            didReturn = true;
            reject("after_handler_timeout");
          }, handlerTimeout)

          background.afterHandlers[tableWithoutPrefix](newData, oldData, (error) => {
            clearTimeout(timer);

            if(!didReturn) {
              resolve();
            }
          })
        }
        else{
          resolve();
        }
      });
    };

    let promises = [];

    if(result.changes){
      for(let i = 0 ; i < result.changes.length ; i++){
        promises.push(afterHandler(result.changes[i].new_val, result.changes[i].old_val));
      }
    }
    else {
      // T_TODO can't we have empty array for Promise.all ?!
      promises.push(new Promise(function(resolve){resolve();}));
    }

    return Promise.all(promises);
  }).then(() =>{
    res.status(200).json({ok: true});
  }).catch((err) => {
    if(typeof err === 'string') {
      return res.status(200).json({ok: false, err: err});
    }

    return next(err);
  });
})

router.post('/workflows.getData', (req, res, next) => {
  let appId = req.body.app_id;
  let queryObject = req.body.query;
  let getAppQ = r.table('apps').filter({manifest_id: appId, is_installed: true});
  let app;

  db.rethinkQuery(getAppQ).then((apps) => {
    if (!apps.length) {
      return new Promise((re, reject) => {reject('app_not_found')});
    }
    app = apps[0];

    if (!queryObject.table) {
      return new Promise((re, reject) => {reject('table_required')});
    }

    let tableName = util.appTable(appId, queryObject.table);

    queryObject.table = tableName;

    let rethinkQ = jsonToQuery(queryObject);

    return db.rethinkQuery(rethinkQ);

  }).then((results, error) => {
    res.status(200).json({ok: true, results: results});
  })
  .catch((err) => {
    if(typeof err === "string") {
      return res.status(200).json({ok: false, err: err});
    }

    return next(err);
  })
});

module.exports = router;
