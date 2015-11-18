"use strict";

const TEAM_ID = process.env.TEAM_ID;

let config = require('config');
let express = require( 'express' );
let r = require('rethinkdb');
let db = require('../db.js');
let utilDB = require('../util_db.js');
let Promise = require('bluebird');
let _ = require('underscore');

let router = express.Router();

let getApps = (userId) => {
  let appsQ =
    r.table('apps')
      .filter({is_installed: true})
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

          for (let i=0; i<len; i++) {
            let userApp = userApps[i];

            if (app.id === userApp.id) {
              response.push(_.extend(app, userApp));
              found = true;

              break;
            }
          }

          if (!found) {
            response.push(app);
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
  /*
  // T_TODO:
  This query bugs, if a user is not subsribed to any channels. Then it doesn't take the channels that he is not subscribed to
 */
  let channelsQ =
  r.table('channels')
    .filter((channel) => {
      return channel('id').match('^C')
    })
    .concatMap((channel) => {
      return r.table('users').get(userId)('channels')
        .filter((uChannel) => {
          return uChannel('id').match('^C')
        })
        .map((uChannel) => {
      	  return r.branch(
            uChannel('id').eq(channel('id')),
            uChannel.merge({is_member: true}),
            channel.merge({is_member: false})
          )
        }).map((fChannel) => {
          return fChannel.merge(channel)
        })
    })

  let imsQ = r.table('users')
    .get(userId)('channels')
    .filter((channel) => {
      return channel('id').match('^D')
    })
    .eqJoin('id', r.table('channels')).zip().without('user_ids')

  // All the users in the team that are not the current logged user
  let notMeQ =
    r.db('swipes')
    .table('teams')
    .getAll(TEAM_ID)
    .withFields("users")
    .concatMap((x) => {
      return x('users').map((user) => {
        return x.merge({users: user})
      })
      .filter((row) => { return row("users") })
    })
    .eqJoin("users", r.db('swipes').table('users'))
    .zip()
    .without("users", "password")

  let promiseArrayQ = [
    db.rethinkQuery(meQ),
    db.rethinkQuery(channelsQ),
    db.rethinkQuery(imsQ),
    db.rethinkQuery(notMeQ),
    getApps(userId)
  ]

  Promise.all(promiseArrayQ)
    .then(data => {
      let rtmResponse = {
        ok: true,
        url: config.get('hostname') + ':' + config.get('port'),
        self: data[0],
        channels: data[1],
        ims: data[2],
        users: data[3],
        apps: data[4]
      }

      res.status(200).json(rtmResponse);
    }).catch(err => {
      return next(err);
    })
})

module.exports = router;
