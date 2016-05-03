"use strict";

const config = require('config');
const express = require( 'express' );
const r = require('rethinkdb');
const Promise = require('bluebird');
const util = require('../util.js');
const db = require('../db.js');
const SwipesError = require( '../swipes-error' );
const router = express.Router();

router.get('/secret.feedback', (req, res, next) => {
  const getFeedbackQ = r.table('feedback');
  const pass = req.query.p;

  if (pass !== 'kittens') {
    return res.send('<h3>You have much to learn young padawan</h3>');
  }

  db.rethinkQuery(getFeedbackQ)
  .then((result) => {
      var html = "";

      if (result && result.length) {
        for (var i=0; i < result.length; i++) {
          var feed = result[i];
          var date = new Date(feed.ts);

          html += "<h5>" + date.toString() + " : " + feed.name + " : " + feed.email + " : " + feed.userId + "</h5>";
          html += "<div>" + feed.feedback + "</div>";
        }
      }

      return res.send(html);
    })
    .catch((e) => {
      return next(e);
    })
});

module.exports = router;
