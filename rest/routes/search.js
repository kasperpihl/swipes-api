"use strict";

let express = require('express');
let router = express.Router();
let Promise = require('bluebird');
let r = require('rethinkdb');
let moment = require('moment');
let db = require('../db.js');
let util = require('../util.js');

let appDir = __dirname + '/../../apps/';

router.post('/search', (req, res, next) => {
  let userId = req.userId;
  let isAdmin = req.isAdmin;
  let query = req.body.query;
  // T_TODO optimize that query for bandwidth
  let listApps =
    r.table('users')
      .get(userId)('apps')
      .filter((app) => {
        return app('is_active').eq(true);
      })
      .eqJoin('id', r.table('apps'))
      .zip()

  if (!query) {
    return res.status(200).json({ok: false, err: 'Query parameter is required'});
  }

  db.rethinkQuery(listApps)
    .then((apps) => {
      let promiseArray = [];

      apps.forEach((app) => {
        let manifest = JSON.parse(util.getFile(appDir + app.manifest_id + '/manifest.json'));

        if (manifest) {
          if (manifest.background) {
            let background = require(appDir + manifest.identifier + "/" + manifest.background);

            if (background && background.methods && background.methods.search) {
              let method = background.methods.search;
              let promise = new Promise((resolve, reject) => {
                // Only ask for results, and resolve no matter what.
                method(query, (results) => {
                  resolve({
                    appId: app.id,
                    name: app.name,
                    results: results
                  });
                })
              })

              promiseArray.push(promise);
            }
          }
        }
      })

      // T_TODO Promise.all it maybe not the right one here
      // We need the search to work even if there is an error
      // with some of the applications
      return Promise.all(promiseArray);
    })
    .then((results) => {
      return res.status(200).json({
        ok: true,
        ts: moment().valueOf() / 1000,
        results: results
      });
    })
    .catch((err) => {
      return next(err);
    })
});

module.exports = router;
