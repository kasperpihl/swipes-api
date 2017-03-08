import r from 'rethinkdb';
import _ from 'underscore';
import db from '../db';

// Add types of events to the specialEvents array
// that are not common and we want to ignore them here
const specialEvents = [];

const commonEventsMultiple = (socket, userId) => {
  const listenQ =
    r.table('events_multiple')
      .filter((e) => {
        return e('user_ids').contains(userId)
              .and(r.expr(specialEvents).contains(e('type')).not());
      })
      .changes();

  db.rethinkQuery(listenQ, { feed: true, socket })
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

          if (n.user_notification_map) {
            const notification_map = n.user_notification_map[userId];

            // We remove the notification_data for users
            // that don't have notification map or created notification for them
            if (!notification_map || !notification_map.id) {
              delete n.notification_data;
            } else {
              n.notification_data = Object.assign({}, n.notification_data, { ...notification_map });
            }
          }

          type = n.type;
          payload = _.omit(n, ['id', 'type', 'user_ids', 'user_notification_map']);
        }

        socket.send(JSON.stringify({
          type,
          payload,
        }));
      });
    });
};

export default commonEventsMultiple;
