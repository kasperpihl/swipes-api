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

  let userChannelsQ = r.table('users').get(userId)('channels');

  db.rethinkQuery(channelMessagesQ, {feed: true})
    .then((cursor) => {
      cursor.each((err, row) => {
        if (err) {
          console.log(err);
          // T_TODO how to handle erros here?!
          // Sending error message on the socket?
          return;
        }

        // T_TODO Implement update and delete here
        let n = row.new_val;
        let type = 'message';
        let message = {};

        let channel_id = n.channel_id;

        db.rethinkQuery(userChannelsQ)
          .then((channels) => {
            if (channels.indexOf(channel_id) !== -1) {
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
