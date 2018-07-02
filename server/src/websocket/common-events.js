/*
  Serving only common events
  Common events are events that are not modified before sending them to the client.
*/

import r from 'rethinkdb';
import _ from 'underscore';
import dbRunQuery from 'src/utils/db/dbRunQuery';

// Add types of events to the specialEvents array
// that are not common and we want to ignore them here
const specialEvents = [];
const commonEvents = (socket, userId) => {
  const listenQ =
    r.table('events')
      .filter((e) => {
        return e('user_id').eq(userId)
          .and(r.expr(specialEvents).contains(e('type')).not());
      })
      .changes();

  dbRunQuery(listenQ, { feed: true, socket })
    .then((cursor) => {
      cursor.each((err, row) => {
        if (err) {
          console.log(err);
          // T_TODO how to handle erros here?!
          // Sending error message on the socket?
          return;
        }

        let type;
        let payload;

        if (!row.old_val) {
          const n = row.new_val;

          type = n.type;
          payload = _.omit(n, ['id', 'type', 'user_id']);
        }

        socket.send(JSON.stringify({
          type,
          payload,
          updated_at: new Date().toISOString(),
        }), (error) => {
          if (error) {
            console.log(error);
            socket.close();
          }
        });
      });
    });
};

export default commonEvents;
