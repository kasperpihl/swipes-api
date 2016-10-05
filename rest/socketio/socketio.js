"use strict";

let r = require('rethinkdb');
//let apps = require('./apps-io.js');
let workflows = require('./workflows-io.js');
let services = require('./services-io.js');
let users = require('./users-io.js');
let common = require('./common-events-io.js');
let commonMultiple = require('./common-events-multiple-io.js');
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

    // scopes = [
    //   apps.hook(socket, userId)
    // ];
    //
    // handleScopeChange(socket, userId);

    //apps.adminApps(socket, userId);
    workflows.userWorkflows(socket, userId);
    services.userServices(socket, userId);
    users.usersProfilePic(socket, userId);
    common.commonEvents(socket, userId);
    commonMultiple.commonEventsMultiple(socket, userId);
  });
};
