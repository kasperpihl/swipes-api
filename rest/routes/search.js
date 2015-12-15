"use strict";

let express = require('express');
let router = express.Router();
let Promise = require('bluebird');
let r = require('rethinkdb');
let db = require('../db.js');
let util = require('../util.js');
let utilDB = require('../util_db.js');

router.post('/search', (req, res, next) => {
  let userId = req.userId;
  let isAdmin = req.isAdmin;
  // T_TODO optimize that query for bandwidth
  let listApps =
    r.table('users')
      .get(userId)('apps')
      .eqJoin('id', r.table('apps'))
      .zip()

  db.rethinkQuery(listApps)
    .then((apps) => {
      return res.status(200).json({ok: true, apps: apps});
    })
    .catch((err) => {
      return next(err);
    })
});

module.exports = router;
