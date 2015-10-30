"use strict";

const TEAM_ID = process.env.TEAM_ID;

let express = require( 'express' );
let r = require('rethinkdb');
let moment = require('moment');
let validator = require('validator');
let util = require('../util.js');
let db = require('../db.js');
let generateId = util.generateSlackLikeId;

let router = express.Router();

router.post('/im.list', (req, res, next) => {
  let userId = req.session.userId;

  let listQ =
    r.table('users')
      .get(userId)('channels')
      .filter((channel) => {
        return channel('id').match('^D')
      })

  db.rethinkQuery(listQ)
    .then((results) => {
        res.status(200).json({ok: true, channels: results});
    }).catch((err) => {
      return next(err);
    });
})

module.exports = router;
