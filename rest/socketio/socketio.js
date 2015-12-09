"use strict";

const TEAM_ID = process.env.TEAM_ID;

let r = require('rethinkdb');
let channels = require('./channels-io.js').channelChanges;
let messages = require('./messages-io.js').channelMessages;
let im = require('./im-io.js');
let stars = require('./stars-io.js');
let apps = require('./apps-io.js');
let common = require('./common-events-io.js');
let db = require('../db.js');
let scopes = [];
let userScope = [];

let controlFeeds = (command, userScope) => {
  scopes.forEach((scope) => {
    scope[command](userScope);
  })
}

let handleScopeChange = (socket, userId) => {
  let scopeCheckQ = r.table("users")
    .filter({id: userId})
    .map((user) => {
      return r.union(
        r.expr([user('id')]),
        user('channels').map((ch) => {return ch('id')}),
        user('apps').map((app) => {return app('id')})
      )
  }).changes({includeInitial: true})

  db.rethinkQuery(scopeCheckQ, {feed: true, socket: socket})
    .then((cursor) => {
      cursor.each((err, row) => {
        if (err) {
          console.log(err);
          // T_TODO how to handle erros here?!
          return;
        }

        let o = row.old_val;
        let n = row.new_val;

        if (!o) {
          controlFeeds('start', n);
        } else {
          controlFeeds('restart', n);
        }
      })
    })
    .catch((err) => {
      console.log(err);
    })
}

module.exports = (io) => {
  io.sockets.on('connection', (socket) => {
    let userId = socket.request.userId;

    if (!userId) {
      return;
    }

    // Prevent memory leak detection
    socket.setMaxListeners(0);

    socket.emit('message', {type: 'hello'});

    scopes = [
      apps.hook(socket, userId),
      messages(socket, userId)
    ];

    handleScopeChange(socket, userId);

    channels(socket, userId);
    im.channelsIm(socket, userId);
    im.userIm(socket, userId);
    stars.stars(socket, userId);
    apps.adminApps(socket, userId);
    common.commonEvents(socket, userId);
  });
};
