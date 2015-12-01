"use strict";

let r = require('rethinkdb');
let db = require('../db.js');

let stars = (socket, userId) => {
  let listenQ =
    r.table('stars')
      .filter((star) => {
        return star('user_id').eq(userId)
      })
      .changes()

  db.rethinkQuery(listenQ, {feed: true, socket: socket})
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

          type = 'star_added';
          data = {
            id: n.item_id,
            type: n.type
          };
        }

        if (!row.new_val) {
          let o = row.old_val;

          type = 'star_removed';
          data = {
            id: o.item_id,
            type: o.type
          };
        }

        socket.emit('message', {type: type, data: data});
      })
    })
}

module.exports = {
  stars: stars
}
