"use strict";

let express = require( 'express' );
let r = require('rethinkdb');
let db = require('../db.js');
let Promise = require('bluebird');

let router = express.Router();

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
});

module.exports = router;
