import r from 'rethinkdb';
import db from '../../../../db';

const dbNotificationsMarkAsSeen = ({ notification_ids }) => {
  const q = r.table('notifications').getAll(r.args(notification_ids)).update({
    seen: r.now(),
  });

  return db.rethinkQuery(q);
};

export {
  dbNotificationsMarkAsSeen,
};
