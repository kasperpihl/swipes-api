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
let appsUtils = require('../utils/apps.js');

// relative directory to installed apps
let appDir = __dirname + '/../../apps/';
let generateId = util.generateSlackLikeId;

require('rethinkdb-init')(r);
let dbConfig = config.get('database');

let updateApp = (appId, updateObj, res, next) => {
  let deletePerUserQ;

  if (updateObj.is_installed === false) {
    deletePerUserQ =
      r.table('users')
        .update((user) => {
          return {
            apps: user('apps').default([]).filter((app) => {
              return app('id').ne(appId)
            })
          }
        })
  }

  let updateQ =
    r.table('apps')
      .get(appId)
      .update(updateObj);

  db.rethinkQuery(updateQ)
    .then(() => {
      if (deletePerUserQ) {
        db.rethinkQuery(deletePerUserQ)
      }

      res.status(200).json({ok: true});
    }).catch((err) => {
      return next(err);
    });
}

let insertApp = (app, res, next) => {
  let insertQ = r.table('apps').insert(app)

  db.rethinkQuery(insertQ)
    .then(() => {
      res.status(200).json({ok: true});
    }).catch((err) => {
      return next(err);
    });
}

let deleteApp = (appId, res, next) => {
  //T_TODO make a real delete at some point. It will slow down the ship right now
  let deletePerUserQ =
    r.table('users')
      .update((user) => {
        return {
          apps: user('apps').default([]).filter((app) => {
            return app('id').ne(appId)
          })
        }
      })

  let deleteQ =
    r.table('apps')
      .get(appId)
      .update({is_installed: false, deleted: true});

  db.rethinkQuery(deletePerUserQ)
    .then(() => {
      db.rethinkQuery(deleteQ)
        .then(() => {
          res.status(200).json({ok: true});
        }).catch((err) => {
          return next(err);
        });
    })
    .catch((err) => {
      return next(err);
    });
}

let dropTables = (tables) => {
  return new Promise(function(resolve, reject) {
    let promiseArray = [];

    tables.forEach((table) => {
      let query = r.tableDrop(table.name);
      let queryPromise = db.rethinkQuery(query);

      promiseArray.push(queryPromise);
    })

    Promise.all(promiseArray)
      .then(() => {
        return resolve();
      }).catch((err) => {
        return reject();
      })
  });
}

let getAppFile = (appId, fileName) => {
  let file;

  try {
    let dest = appDir + appId + '/' + fileName;

    file = fs.readFileSync(dest, 'utf8');
  } catch (err) {
    console.log(err);
    file = null;
  }

  return file;
}

let getFolderNames = (dir, filter) => {
  return new Promise(function(resolve, reject) {
    let folderNames = [];

    fs.readdir(dir, (err, files) => {
      if (err) {
        return reject(err);
      }

      let folders = files.filter((file) => {
        return filter.indexOf(file) < 0 && fs.statSync(dir + file).isDirectory();
      })

      return resolve(folders);
    });
  });
}

router.post('/apps.list', (req, res, next) => {
  getFolderNames(appDir, ['app-loader'])
    .then((folders) => {
      let fsApps = [];

      folders.forEach((folder) => {
        fsApps.push(JSON.parse(getAppFile(folder, 'manifest.json')));
      })

      let isAdmin = req.isAdmin;
      let listQ = utilDB.appsList(isAdmin);

      db.rethinkQuery(listQ)
        .then((apps) => {
          let whitelist = [
            'id',
            'manifest_id',
            'title',
            'description',
            'version',
            'is_installed',
            'url',
            'required'
          ]

          apps.forEach((app) => {
            fsApps = fsApps.map((fsApp) => {
              if (app.manifest_id === fsApp.identifier) {
                fsApp.id = app.id;
                if(fsApp.channel_view)
                  fsApp.channel_view_url = util.appUrl(req, fsApp, "channel_view");
                if(fsApp.main_app)
                  fsApp.main_app_url = util.appUrl(req, fsApp, "main_app");

                if (app.is_installed) {
                  fsApp.is_installed = true;
                }

                if (isAdmin && app.required) {
                  fsApp.required = true;
                }
              }

              return fsApp;
            })
          })

          fsApps = fsApps.filter((fsApp) => {
            if (isAdmin) {
              return true;
            } else {
              return fsApp.is_installed && !fsApp.admin_only;
            }
          }).map((fsApp) => {
            fsApp.manifest_id = fsApp.identifier;
            // Whitelist properties
            fsApp = _.pick(fsApp, whitelist);

            return fsApp;
          })

          return res.status(200).json({ok: true, apps: fsApps});
        }).catch((err) => {
          return next(err);
        });
    }).catch((err) => {
      return next(err);
    })
});

router.post('/apps.install', (req, res, next) => {
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

    manifest = JSON.parse(getAppFile(manifestId, 'manifest.json'));

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
    if(manifest.channel_view)
      updateObj.channel_view = manifest.channel_view;
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

router.post('/apps.uninstall', (req, res, next) => {
  let isAdmin = req.isAdmin;

  if (!isAdmin) {
    return res.status(200).json({ok: false, err: 'not_admin'});
  }

  let appId = req.body && req.body.app_id;

  if (!appId) {
    return res.status(200).json({ok: false, err: 'app_id_required'});
  }

  let updateObj = {is_installed: false};

  updateApp(appId, updateObj, res, next);
});

router.post('/apps.delete', (req, res, next) => {
  //T_TODO
  // delete the files of the app
  // remove all the users from that app
  let isAdmin = req.isAdmin;

  if (!isAdmin) {
    return res.status(200).json({ok: false, err: 'not_admin'});
  }

  let appId = req.body && req.body.app_id;

  if (!appId) {
    return res.status(200).json({ok: false, err: 'app_id_required'});
  }

  let getAppQ = r.table('apps').get(appId);

  db.rethinkQuery(getAppQ)
    .then((app) => {
      if (!app) {
        return new Promise((re, reject) => { reject('no_app_found')});
      }

      let manifest = JSON.parse(getAppFile(app.manifest_id, 'manifest.json'));

      if (!manifest) {
        return new Promise((re, reject) => { reject('no_manifest_found')});
      }

      let tables = manifest.tables;

      if (!tables || tables.length < 1) {
        deleteApp(appId, res, next);
        return;
      }

      let prefixedTables = tables.map((item) => {
        let name = app.manifest_id + '_' + item.name;

        item.name = name;
        return item;
      })
      return dropTables(prefixedTables);
    }).then(() => {
      //T_TODO delete the files too
      deleteApp(appId, res, next);
    })
    .catch((err) => {
      if(typeof err === "string")
        return res.status(200).json({ok: false, err: err});
      return next(err)
    })
});



router.post('/apps.method', (req, res, next) => {
  let manifestId = req.body.manifest_id;
  let method = req.body.method;
  let data = req.body.data || {};

  appsUtils.callAppMethod(manifestId, method, data)
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


router.post('/apps.saveData', (req, res, next) => {
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
    let manifest = JSON.parse(getAppFile(appId, 'manifest.json'));
    if (!manifest) {
      return res.status(200).json({ok: false, err: 'no_manifest_found'});
    }

    // Check if app has background script setup
    if(manifest.background){
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

router.post('/apps.getData', (req, res, next) => {
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
