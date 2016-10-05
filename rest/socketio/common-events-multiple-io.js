"use strict";

/*
  Serving only common events
  Common events are events that are not modified before sending them to the client.
*/

import r from 'rethinkdb';
import db from '../db.js';
import _ from 'underscore';

// Add types of events to the specialEvents array
// that are not common and we want to ignore them here
const specialEvents = [];

const commonEventsMultiple = (socket, userId) => {
  const listenQ =
    r.table('events_multiple')
      .filter((e) => {
        return e('user_ids').contains(userId)
              .and(r.expr(specialEvents).contains(e('type')).not())
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

        let type;
        let omitted;

        if (!row.old_val) {
          const n = row.new_val;

          type = n.type;
          omitted = _.omit(n, ['id', 'type', 'user_ids']);
        }

        socket.emit('message', {type: type, data: omitted.data});
      })
    })
}

module.exports = {
  commonEventsMultiple: commonEventsMultiple
}
