"use strict";

const TEAM_ID = process.env.TEAM_ID;

let r = require('rethinkdb');
let db = require('../db.js');

module.exports.imChanges = (socket, userId) => {
  let listenQ =
    r.table('channels')
      .filter((doc) => {
        return doc('teamId')
          .eq(TEAM_ID)
          .and(doc('id').match("^D"))
          .and(doc('user_ids').contains(userId))
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

            type = 'im_created';
            data = {
              channel_id: n.id,
              user_id: n.creator_id,
              created: n.created
            };
          }

          socket.emit('message', {type: type, data: data});
        })
      })
 }
