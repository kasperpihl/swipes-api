"use strict";

let express = require( 'express' );
let r = require('rethinkdb');
let db = require('../db.js');

let router = express.Router();

router.get('/users.list', (req, res, next) => {
  let query = r.table('users');

  db.rethinkQuery(query)
    .then((results) => {
        res.status(200).json({ok: true, results: results});
    }).catch((err) => {
      return next(err);
    });
});

module.exports = router;
