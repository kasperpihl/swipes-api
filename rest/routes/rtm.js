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

let getChannels = (userId) => {
  let channelsQ =
    r.table('channels')
      .filter((channel) => {
        return channel('id').match('^C')
      })
      .coerceTo('Array');

  let userChannels =
    r.table('users')
      .get(userId)('channels')
      .filter((channel) => {
        return channel('id').match('^C')
      })
      .coerceTo('Array');

  let channelListQ =
    r.do(channelsQ, userChannels, (channels, userChannels) => {
      return r.expr([channels, userChannels])
    });

  return new Promise((resolve, reject) => {
    db.rethinkQuery(channelListQ)
      .then((results) => {
        let channels = results[0];
        let userChannels = results[1];
        let response = [];

        channels.forEach((channel) => {
          let found = false;
          let len = userChannels.length;

          for (let i=0; i<len; i++) {
            let userChannel = userChannels[i];

            if (channel.id === userChannel.id) {
              response.push(_.extend(channel, userChannel, {is_member: true}));
              found = true;

              break;
            }
          }

          if (!found) {
            response.push(_.extend(channel, {is_member: false}));
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
    getChannels(userId),
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
