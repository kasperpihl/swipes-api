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

let restartFeeds = () => {
  scopes.forEach((scope) => {
    scope.restart();
  })
}

let handleScopeChange = (userId) => {
  let scopeCheckQ = r.table('users').get(userId).changes();

  db.rethinkQuery(scopeCheckQ, {feed: true})
    .then((cursor) => {
      cursor.each((err, row) => {
        if (err) {
          console.log(err);
          // T_TODO how to handle erros here?!
          return;
        }

        let o = row.old_val;
        let n = row.new_val;

        if (o.apps.length !== n.apps.length || o.channels.length !== n.channels.length) {
          restartFeeds();
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

    socket.emit('message', {type: 'hello'});

    handleScopeChange(userId);

    scopes = [
      apps.hook(socket, userId)
    ];

    scopes.forEach((scope) => {
      scope.start();
    })

    channels(socket, userId);
    messages(socket, userId);
    im.channelsIm(socket, userId);
    im.userIm(socket, userId);
    stars.stars(socket, userId);
    apps.adminApps(socket, userId);
    common.commonEvents(socket, userId);
  });
};
