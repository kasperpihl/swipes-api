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

let getChannels = (userId) => {
  let channelsQ =
    r.table('channels')
      .filter((channel) => {
        return channel('id').match('^C')
      })
      .coerceTo('Array');

  let userChannelsQ =
    r.table('users')
      .get(userId)('channels')
      .filter((channel) => {
        return channel('id').match('^C')
      })
      .coerceTo('Array');

  let channelListQ =
    r.do(channelsQ, userChannelsQ, (channels, userChannels) => {
      return r.expr([channels, userChannels])
    });

  return new Promise((resolve, reject) => {
    db.rethinkQuery(channelListQ)
      .then((results) => {
        let channels = results[0];
        let userChannels = results[1];
        let unreadCountPromises = [];
        let response = [];

        channels.forEach((channel) => {
          let found = false;
          let len = userChannels.length;

          for (let i=0; i<len; i++) {
            let userChannel = userChannels[i];

            if (channel.id === userChannel.id) {
              let unreadCountQ =
                r.table('messages')
                  .getAll(channel.id, {index: 'channel_id'})
                  .filter(r.row("ts").gt(userChannel.last_read))
                  .count();

              unreadCountPromises.push(db.rethinkQuery(unreadCountQ));
              response.push(_.extend(channel, userChannel, {is_member: true}));
              found = true;

              break;
            }
          }

          if (!found) {
            response.push(_.extend(channel, {is_member: false}));
          }
        })

        Promise.all(unreadCountPromises).then((unreadCountRes) => {
          response.forEach((item, idx) => {
            let unreadCount = unreadCountRes[idx] || 0;

            response[idx].unread_count = unreadCount;
          })

          return resolve(response);
        })
        .catch((err) => {
          return reject(err);
        })
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

  let users = r.table('users').without("password")

  let promiseArrayQ = [
    db.rethinkQuery(meQ),
    getChannels(userId),
    db.rethinkQuery(imsQ),
    db.rethinkQuery(users),
    getApps(userId, isAdmin, req)
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
