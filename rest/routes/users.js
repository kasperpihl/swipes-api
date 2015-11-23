"use strict";

let express = require( 'express' );
let r = require('rethinkdb');
let db = require('../db.js');
let utilDB = require('../util_db.js');
let Promise = require('bluebird');

let router = express.Router();

let isActive = (userId, appId) => {
  return new Promise((resolve, reject) => {
    let isActiveQ =
      r.table('users')
        .get(userId)('apps')
        .filter((app) => {
          return app('id').eq(appId)
        })

    db.rethinkQuery(isActiveQ)
      .then((app) => {
        return resolve(app);
      })
      .catch((err) => {
        return reject(err);
      })
  })
}

router.post('/users.list', (req, res, next) => {
  let query = r.table('users');

  db.rethinkQuery(query)
    .then((results) => {
        return res.status(200).json({ok: true, results: results});
    }).catch((err) => {
      return next(err);
    });
});

router.post('/users.activateApp', (req, res, next) => {
  let userId = req.userId;
  let appId = req.body.app_id;

  //T_TODO check if the user can activate that app

  isActive(userId, appId)
    .then((app) => {
      if(app.length > 0 && app[0].is_active === true) {
        return res.status(200).json({ok: false, err: 'already_activated'});
      }

      let updateAppsQ;

      if(app.length > 0 && app[0].is_active === false) {
        updateAppsQ = utilDB.updateUserAppQ(userId, appId, {is_active: true});
      } else {
        updateAppsQ =
          r.table('users')
            .get(userId)
            .update((user) => {
              return {
                apps: user('apps').default([]).append({
                  id: appId,
                  is_active: true
                })
              }
            })
      }

      let eventQ = r.table('events').insert({
        app_id: appId,
        type: 'app.activated',
        user_id: userId
      })

      db.rethinkQuery(updateAppsQ)
        .then(() => {
          db.rethinkQuery(eventQ)

          return res.status(200).json({ok: true});
        })
        .catch((err) => {
          return next(err);
        })
    })
    .catch((err) => {
      return next(err);
    })
});

router.post('/users.deactivateApp', (req, res, next) => {
  let userId = req.userId;
  let appId = req.body.app_id;

  //T_TODO check if the user can unactivate that app

  let unActivateQ = utilDB.updateUserAppQ(userId, appId, {is_active: false});

  let eventQ = r.table('events').insert({
    app_id: appId,
    type: 'app.deactivated',
    user_id: userId
  })

  db.rethinkQuery(unActivateQ)
    .then(() => {
      db.rethinkQuery(eventQ)

      return res.status(200).json({ok: true});
    })
    .catch((err) => {
      return next(err);
    })
});

module.exports = router;
