"use strict";

const TEAM_ID = process.env.TEAM_ID;

let r = require('rethinkdb');
let db = require('../db.js');

let channelsIm = (socket, userId) => {
  let listenQ =
    r.table('channels')
      .filter((channel) => {
        return channel('teamId').eq(TEAM_ID)
          .and(channel('id').match('^D'))
          .and(channel('user_ids').contains(userId))
      }).changes()

    db.rethinkQuery(listenQ, {feed: true})
      .then((cursor) => {
        cursor.each((err, row) => {
          if (err) {
            console.log(err);
            // T_TODO how to handle erros here?!
            // Sending error message on the socket?
            return;
          }

          let data;
          let type;

          if (!row.old_val) {
            let n = row.new_val;
            let targetUserId;

            n.user_ids.forEach((user_id) => {
              if (user_id !== userId) {
                targetUserId = user_id;
              }
            })

            type = 'im_created';
            data = {
              user_id: targetUserId,
              channel: n
            };
          }

          socket.emit('message', {type: type, data: data});
        })
      })
 }

let userIm = (socket, userId) => {
  let listenQ =
    r.table('events')
      .filter((e) => {
        return e('type').eq('im_open')
          .and(e('user_id').eq(userId))
      })
      .changes()

  db.rethinkQuery(listenQ, {feed: true})
    .then((cursor) => {
      cursor.each((err, row) => {
        if (err) {
          console.log(err);
          // T_TODO how to handle erros here?!
          // Sending error message on the socket?
          return;
        }

        let type;
        let data;

        if (!row.old_val) {
          let n = row.new_val;

          type = 'im_open';
          data = {
            channel_id: n.channel_id,
            user_id: n.target_user_id
          };
        }

        socket.emit('message', {type: type, data: data});
      })
    })
 }

 module.exports = {
   channelsIm: channelsIm,
   userIm: userIm
 }
