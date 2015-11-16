"use strict";

let express = require( 'express' );
let r = require('rethinkdb');
let db = require('../db.js');
let Promise = require('bluebird');

let router = express.Router();

let isActive = (userId, appId) => {
  return new Promise((resolve, reject) => {
    let isActiveQ =
      r.table('users')
        .get(userId)('apps')
        .filter((app) => {
          return app('id').eq(appId).and(app('is_active').eq(true))
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

  //T_TODO check if the user can install that app

  isActive(userId, appId)
    .then((app) => {
      if (app.length > 0) {
        let appendAppQ =
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

        db.rethinkQuery(appendAppQ)
          .then(() => {
            return res.status(200).json({ok: true});
          })
          .catch((err) => {
            return next(err);
          })
      } else {
        return res.status(200).json({ok: false, err: 'already_activated'});
      }
    })
    .catch((err) => {
      return next(err);
    })
});

module.exports = router;
