"use strict";

const TEAM_ID = process.env.TEAM_ID;

let r = require('rethinkdb');
let db = require('../db.js');

module.exports.channelMessages = (socket, userId) => {
  let channelMessagesQ =
    r.table('messages')
      .filter((doc) => {
        return doc('channel_id').match("^C")
      }).changes()

  db.rethinkQuery(channelMessagesQ, {feed: true})
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

        let channel_id = n.channel_id;

        let matchChannelQ =
          r.table('users')
          .get(userId)('channels')
          .filter((channel) => {
            return channel("id").match(channel_id)
          })
          .count();

        db.rethinkQuery(matchChannelQ)
          .then((count) => {
            if (count > 0) {
              message = {
                channel_id: n.channel_id,
                user_id: n.user_id,
                text: n.text,
                ts: n.ts
              }

              socket.emit('message', {type: type, message: message});
            }
          })
      })
    })
}
