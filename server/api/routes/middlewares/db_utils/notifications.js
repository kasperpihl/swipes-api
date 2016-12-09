import r from 'rethinkdb';
import db from '../../../../db';

const dbNotificationsMarkAsSeen = ({ notification_ids }) => {
  const q = r.table('notifications').getAll(r.args(notification_ids)).update({
    seen: r.now(),
  });

  return db.rethinkQuery(q);
};

const dbNotificationsGetAllByIdOrderByTs = ({ user_id }) => {
  const q =
    r.table('notifications')
      .getAll(user_id, { index: 'user_id' })
      .orderBy(r.desc('ts'))
      .limit(100);

  return db.rethinkQuery(q);
};

export {
  dbNotificationsMarkAsSeen,
  dbNotificationsGetAllByIdOrderByTs,
};
