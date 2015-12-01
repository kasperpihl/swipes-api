"use strict";

const TEAM_ID = process.env.TEAM_ID;

let r = require('rethinkdb');
let db = require('../db.js');
let ChangeFeedManager = require('./ChangeFeedManager.js');

module.exports.channelMessages = (socket, userId) => {
  let start = (userScope) => {
    return new Promise((resolve, reject) => {
      let channelMessagesQ =
        r.table('messages')
          .filter((doc) => {
            return r.expr(userScope).contains(doc('scope'));
          }).changes()

      db.rethinkQuery(channelMessagesQ, {feed: true, socket: socket})
        .then((cursor) => {
          cursor.each((err, row) => {
            if (err) {
              console.log(err);
              // T_TODO how to handle errors here?!
              // Sending error message on the socket?
              return;
            }

            // T_TODO Implement update and delete here
            let n = row.new_val;
            let type = 'message';
            let message = {};

            socket.emit('message', {type: type, message: message});
          })
        })
    })
  }

  return ChangeFeedManager({start: start});
}
