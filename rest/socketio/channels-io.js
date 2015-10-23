"use strict";

const TEAM_ID = process.env.TEAM_ID;

let r = require('rethinkdb');
let db = require('../db.js');

module.exports.channelChanges = (socket) => {
  let insertQ =
    r.table('channels')
      .filter({teamId: TEAM_ID})
      .changes()

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
              id: n.id,
              name: n.name,
              created: n.created
              // T_TODO put user ID here `creator`
            };
          } else {
            let o = row.old_val;
            let n = row.new_val;

            if (o.name !== n.name) {
              type = 'channel_rename';
              data = {
                id: n.id,
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
                channel: n.id
                // T_TODO put user ID here
              }
            }

            if (o.deleted !== n.deleted && n.deleted === true) {
              type = 'channel_deleted';
              data = {channel: n.id};
            }
          }

          socket.emit('message', {type: type, data: data});
        })
      })
 }
