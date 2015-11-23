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

// relative directory to installed apps
let appDir = __dirname + '/../../apps/';
let generateId = util.generateSlackLikeId;

require('rethinkdb-init')(r);
let dbConfig = config.get('dbConfig');

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
            'url'
          ]

          apps.forEach((app) => {
            fsApps = fsApps.map((fsApp) => {
              if (app.manifest_id === fsApp.identifier) {
                fsApp.id = app.id;
                fsApp.url = util.appUrl(req, app);

                if (app.is_installed) {
                  fsApp.is_installed = true;
                }
              }

              return fsApp;
            })
          })

          // whitelist properties
          fsApps = fsApps.map((fsApp) => {
            fsApp.manifest_id = fsApp.identifier;
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
    getAppQ =
      r.table('apps')
        .filter((app) => {
          return app('manifest_id').eq(manifestId)
            .and(app.hasFields('deleted').not())
        });
  }

  db.rethinkQuery(getAppQ)
    .then((app) => {
      if(!app) {
        return res.status(200).json({ok: false, err: 'no_app_found'});
      }

      if (app.deleted === true) {
        return res.status(200).json({ok: false, err: 'app_deleted'});
      }

      app = app.length > 0 ? app[0] : app;

      if (app && app.is_installed) {
        return res.status(200).json({ok: false, err: 'already_installed'});
      } else if (app && app.is_installed === false && app.deleted !== true) {
        if (!appId) {
          return res.status(200).json({ok: false, err: 'app_id_required'});
        }

        let updateObj = {is_installed: true};

        updateApp(appId, updateObj, res, next);
      } else {
        let manifest = JSON.parse(getAppFile(manifestId, 'manifest.json'));

        if (!manifest) {
          return res.status(200).json({ok: false, err: 'no_manifest_found'});
        }

        let tables = manifest.tables;
        let appId = generateId('A');
        let insertObj = {
          id: appId,
          manifest_id: manifestId,
          name: manifest.title,
          description: manifest.description,
          version: manifest.version,
          is_installed: true
        };

        if (!tables || tables.length < 1) {
          insertApp(insertObj, res, next);
          return;
        }

        let prefixedTables = tables.map((item) => {
          let name = appId + '_' + item.name;

          item.name = name;
          return item;
        })

        r.init(dbConfig, prefixedTables)
          .then(() => {
            insertApp(insertObj, res, next);
          }).catch((err) => {
            return next(err);
          });
      }
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
        return res.status(200).json({ok: false, err: 'no_app_found'});
      }

      let manifest = JSON.parse(getAppFile(app.manifest_id, 'manifest.json'));

      if (!manifest) {
        return res.status(200).json({ok: false, err: 'no_manifest_found'});
      }

      let tables = manifest.tables;

      if (!tables || tables.length < 1) {
        deleteApp(appId, res, next);
        return;
      }

      let prefixedTables = tables.map((item) => {
        let name = appId + '_' + item.name;

        item.name = name;
        return item;
      })

      dropTables(prefixedTables)
        .then(() => {
          //T_TODO delete the files too
          deleteApp(appId, res, next);
        }).catch((err) => {
          return next(err);
        });
    })
    .catch((err) => {
      return next(err)
    })
});

router.get('/apps.load', (req, res, next) => {
  let appId = req.query.app_id;
  let manifestId = req.query.manifest_id;
  let manifest = JSON.parse(getAppFile(manifestId, 'manifest.json'));

  // TODO: Do validations and stuff
  if (!manifest) {
    return res.status(200).json({ok: false, err: 'no_manifest_found'});
  }

  let indexFile = getAppFile(manifestId, manifest.main_app.index);

  if(!indexFile){
    return res.status(200).json({ok: false, err: 'no_index_found'});
  }

  let apiHost = 'http://' + req.headers.host
  let appUrlDir = apiHost + '/apps/' + manifestId
  let _defUrlDir = apiHost + '/apps/app-loader/'

  // Insert dependencies, SwipesSDK and other scripts right after head
  let insertString = '';
  insertString += '<script src="' + _defUrlDir + 'jquery.min.js"></script>\r\n';
  insertString += '<script src="' + _defUrlDir + 'underscore.min.js"></script>\r\n';
  insertString += '<script src="' + _defUrlDir + 'swipes-api-connector.js"></script>\r\n';
  insertString += '<script src="' + _defUrlDir + 'swipes-app-sdk.js"></script>\r\n';
  if(!manifest.main_app.disableUIKit){
    insertString += '<link rel="stylesheet" href="' + _defUrlDir + 'swipes-ui-kit/ui-kit-main.css"/>\r\n';
    insertString += '<script src="' + _defUrlDir + 'swipes-ui-kit/ui-kit-main.js"></script>\r\n';
  }
  insertString += '<script>';
  insertString += 'window.swipes = new SwipesAppSDK("'+apiHost+'", "' + req.query.token + '");\r\n';
  insertString += 'swipes._client.setListener(parent, "' + req.headers.referer + '");\r\n';
  insertString += 'swipes._client.setAppId("' + appId + '");\r\n';
  insertString += 'swipes.navigation.setTitle("' + manifest.title + '");'
  insertString += 'swipes.info.manifest = ' + JSON.stringify(manifest) + ';';
  insertString += 'swipes.info.userId = "' + req.userId + '";';
  insertString += '</script>\r\n';
  var index = indexFile.indexOf('<head>')
  if(index != -1){
    index += 6
    indexFile = indexFile.slice(0, index) + insertString + indexFile.slice(index);
  }
  // Replace <{appDir}}> with actual host
  indexFile = indexFile.replace(new RegExp('<{appDir}>', 'g'), appUrlDir );

  res.status(200).send(indexFile);
});

router.post('/apps.saveData', (req, res, next) => {
  let appId = req.body.app_id;
  let queryObject = req.body.query;

  if (!queryObject.table) {
    return res.status(200).json({ok: false, err: 'table_required'});
  }

  if (!queryObject.data) {
    return res.status(200).json({ok: false, err: 'data_required'});
  }

  let tableName = util.appTable(appId, queryObject.table);

  queryObject.table = tableName;

  let rethinkQ = jsonToQuery(queryObject);

  db.rethinkQuery(rethinkQ)
    .then(() => {
      res.status(200).json({ok: true});
    }).catch((err) => {
      return next(err);
    });
})

router.post('/apps.getData', (req, res, next) => {
  let appId = req.body.app_id;
  let queryObject = req.body.query;

  if (!queryObject.table) {
    return res.status(200).json({ok: false, err: 'table_required'});
  }

  let tableName = util.appTable(appId, queryObject.table);

  queryObject.table = tableName;

  let rethinkQ = jsonToQuery(queryObject);

  db.rethinkQuery(rethinkQ)
    .then((results) => {
      res.status(200).json({ok: true, results: results});
    }).catch((err) => {
      return next(err);
    });
});

module.exports = router;
