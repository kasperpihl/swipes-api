"use strict";

let r = require('rethinkdb');
let db = require('../db.js');
let _ = require('underscore');

let commonEvents = (socket, userId) => {
  let listenQ =
    r.table('events')
      .filter((e) => {
        return e('user_id').eq(userId)
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

          type = n.type;
          data = _.omit(n, ['id', 'type']);
        }

        socket.emit('message', {type: type, data: data});
      })
    })
}

module.exports = {
  commonEvents: commonEvents
}
