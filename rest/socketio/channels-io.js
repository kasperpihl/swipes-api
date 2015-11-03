"use strict";

const TEAM_ID = process.env.TEAM_ID;

let r = require('rethinkdb');
let db = require('../db.js');

module.exports.channelChanges = (socket, userId) => {
  let insertQ =
    r.table('channels')
      .filter((doc) => {
        return doc('teamId').eq(TEAM_ID).and(doc('id').match("^C"))
      }).changes()

    db.rethinkQuery(insertQ, {feed: true})
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

            type = 'channel_created';
            data = {
              channel_id: n.id,
              name: n.name,
              creator_id: n.creator_id,
              created: n.created
            };
          } else {
            let o = row.old_val;
            let n = row.new_val;

            if (o.name !== n.name) {
              type = 'channel_rename';
              data = {
                channel_id: n.id,
                name: n.name
              };
            }

            if (o.is_archived !== n.is_archived) {
              if (n.is_archived === true) {
                type = 'channel_archive';
              } else {
                type = 'channel_unarchive';
              }

              data = {
                channel_id: n.id,
                user_id: userId
              }
            }

            if (o.deleted !== n.deleted && n.deleted === true) {
              type = 'channel_deleted';
              data = {
                channel_id: n.id
              };
            }
          }

          socket.emit('message', {type: type, data: data});
        })
      })
 }
