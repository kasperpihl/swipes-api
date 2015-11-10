"use strict";

let express = require( 'express' );
let router = express.Router();
let fs = require('fs');
let r = require('rethinkdb');
let config = require('config');
let db = require('../db.js');

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

let getManifest = (appId) => {
  let manifest;

  try {
    let dest = __dirname + '/../../apps/' + appId + '/manifest.json';

    manifest = JSON.parse(fs.readFileSync(dest, 'utf8'));
  } catch (err) {
    console.log(err);
    manifest = null;
  }

  return manifest;
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
        let manifest = getManifest(appId);

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
  let manifest = getManifest(appId);

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
  res.send("success")
});

module.exports = router;
