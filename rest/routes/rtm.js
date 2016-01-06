"use strict";

let config = require('config');
let express = require( 'express' );
let r = require('rethinkdb');
let util = require('../util.js');
let db = require('../db.js');
let Promise = require('bluebird');
let _ = require('underscore');

let router = express.Router();

let getApps = (userId, isAdmin, req) => {
  let filter;

  if (isAdmin) {
    filter = {is_installed: true};
  } else {
    filter = (app) => {
      return app('is_installed').eq(true).and(app.hasFields('admin_only').not());
    }
  }

  let appsQ =
    r.table('apps')
      .filter(filter)
      .without('is_installed')
      .coerceTo('Array');

  let userAppsQ =
    r.table('users')
      .get(userId)('apps')
      .default([]);

  let appsListQ =
    r.do(appsQ, userAppsQ, (apps, userApps) => {
      return r.expr([apps, userApps])
    });

  return new Promise((resolve, reject) => {
    db.rethinkQuery(appsListQ)
      .then((results) => {
        let apps = results[0];
        let userApps = results[1];
        let response = [];

        apps.forEach((app) => {
          let found = false;
          let len = userApps.length;

          if(app.channel_view) {
            app.channel_view_url = util.appUrl(req, app, "channel_view");
          }

          if(app.preview_view) {
            app.preview_view_url = util.appUrl(req, app, "preview_view");
          }

          if(app.main_app) {
            app.main_app_url = util.appUrl(req, app, "main_app");
          }

          for (let i=0; i<len; i++) {
            let userApp = userApps[i];

            if (app.id === userApp.id) {
              response.push(_.extend(app, userApp));
              found = true;

              break;
            }
          }

          if (app.required) {
            response.push(_.extend(app, {is_active: true}));
          } else if (!found) {
            response.push(_.extend(app, {is_active: false}));
          }
        })

        return resolve(response);
      })
      .catch((err) => {
        return reject(err);
      })
  })
}

router.post('/rtm.start', (req, res, next) => {
  let userId = req.userId;
  let isAdmin = req.isAdmin;

  let meQ = r.table('users').get(userId).without('password');

  let users = r.table('users').without("password")

  let promiseArrayQ = [
    db.rethinkQuery(meQ),
    db.rethinkQuery(users),
    getApps(userId, isAdmin, req)
  ]

  Promise.all(promiseArrayQ)
    .then(data => {
      let rtmResponse = {
        ok: true,
        url: config.get('hostname') + ':' + config.get('port'),
        self: data[0],
        users: data[1],
        apps: data[2]
      }

      res.status(200).json(rtmResponse);
    }).catch(err => {
      return next(err);
    })
})

module.exports = router;
