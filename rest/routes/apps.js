"use strict";

let express = require( 'express' );
let router = express.Router();
let fs = require('fs');
let r = require('rethinkdb');
let config = require('config');
let db = require('../db.js');
let jsonToQuery = require('../json_to_query.js').jsonToQuery;
let util = require('../util.js');
// relative directory to installed apps
let appDir = __dirname + '/../../apps/';

require('rethinkdb-init')(r);
let dbConfig = config.get('dbConfig');

let updateApp = (appId, updateObj, res, next) => {
  let updateQ =
    r.table('apps')
      .get(appId)
      .update(updateObj);

  db.rethinkQuery(updateQ)
    .then(() => {
      res.status(200).json({ok: true});
    }).catch((err) => {
      return next(err);
    });
}

let deleteApp = (appId, res, next) => {
  //T_TODO make a real delete at some point. It will slow down the ship right now
  let updateQ =
    r.table('apps')
      .get(appId)
      .delete();

  res.status(200).json({ok: true});

  // db.rethinkQuery(updateQ)
  //   .then(() => {
  //     res.status(200).json({ok: true});
  //   }).catch((err) => {
  //     return next(err);
  //   });
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

router.post('/apps.list', (req, res, next) => {
  let isAdmin = req.isAdmin;
  let filter = isAdmin ? {} : {is_active: true};
  let listQ = r.table('apps').filter(filter);

  db.rethinkQuery(listQ)
    .then((apps) => {
      res.status(200).json({ok: true, apps: apps});
    }).catch((err) => {
      return next(err);
    });
});

router.post('/apps.activate', (req, res, next) => {
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
      if (app.is_active) {
        return res.status(200).json({ok: false, err: 'already_active'});
      } else if (app.is_active === false) {
        let updateObj = {is_active: true};

        updateApp(appId, updateObj, res, next);
      } else {
        let updateObj = {is_active: true};
        let manifest = JSON.parse(getAppFile(appId, 'manifest.json'));

        if (!manifest) {
          return res.status(200).json({ok: false, err: 'no_manifest_found'});
        }

        let tables = manifest.tables;

        if (!tables || tables.length < 1) {
          updateApp(appId, updateObj, res, next);
          return;
        }

        let prefixedTables = tables.map((item) => {
          let name = appId + '_' + item.name;

          item.name = name;
          return item;
        })

        r.init(dbConfig, prefixedTables)
          .then(() => {
            updateApp(appId, updateObj, res, next);
          }).catch((err) => {
            return next(err);
          });
      }
    }).catch((err) => {
      return next(err);
    });
});

router.post('/apps.deactivate', (req, res, next) => {
  let isAdmin = req.isAdmin;

  if (!isAdmin) {
    return res.status(200).json({ok: false, err: 'not_admin'});
  }

  let appId = req.body && req.body.app_id;

  if (!appId) {
    return res.status(200).json({ok: false, err: 'app_id_required'});
  }

  let updateObj = {is_active: false};

  updateApp(appId, updateObj, res, next);
});

router.post('/apps.delete', (req, res, next) => {
  //T_TODO
  // delete the files of the app
  // remove all the users from that app
  // remove the app row from apps table
  let isAdmin = req.isAdmin;

  if (!isAdmin) {
    return res.status(200).json({ok: false, err: 'not_admin'});
  }

  let appId = req.body && req.body.app_id;

  if (!appId) {
    return res.status(200).json({ok: false, err: 'app_id_required'});
  }

  let deleteQ = r.table('apps').get(appId).delete();
  let manifest = JSON.parse(getAppFile(appId, 'manifest.json'));

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
      //T_TODO faking delete here
      let updateObj = {is_active: null};
      updateApp(appId, updateObj, res, next);
      //deleteApp(appId, res, next);
    }).catch((err) => {
      return next(err);
    });
});

router.get('/apps.load', (req, res, next) => {
  let appId = req.query.appId;
  let manifest = JSON.parse(getAppFile(appId, 'manifest.json'));

  // TODO: Do validations and stuff
  if (!manifest) {
    return res.status(200).json({ok: false, err: 'no_manifest_found'});
  }

  let indexFile = getAppFile(appId, manifest.main_app.index);

  if(!indexFile){
    return res.status(200).json({ok: false, err: 'no_index_found'});
  }

  let apiHost = 'http://' + req.headers.host
  let appUrlDir = apiHost + '/apps/' + appId
  let _defUrlDir = apiHost + '/apps/app-loader/'

  // Insert dependencies, SwipesSDK and other scripts right after head
  let insertString = '';
  insertString += '<script src="' + _defUrlDir + 'jquery.min.js"></script>\r\n';
  insertString += '<script src="' + _defUrlDir + 'swipes-api-connector.js"></script>\r\n';
  insertString += '<script src="' + _defUrlDir + 'swipes-app-sdk.js"></script>\r\n';
  if(!manifest.main_app.disableUIKit){
    insertString += '<script src="' + _defUrlDir + 'swipes-ui-kit/ui-kit-main.js"></script>\r\n';
    insertString += '<link rel="stylesheet" href="' + _defUrlDir + 'swipes-ui-kit/ui-kit-main.css"/>\r\n';
  }
  insertString += '<script>';
  insertString += 'window.swipes = new SwipesAppSDK("'+apiHost+'", "' + req.query.token + '");\r\n';
  insertString += 'swipes._client.setListener(parent, "' + req.headers.referer + '"); swipes.navigation.setTitle("Test");\r\n';
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
