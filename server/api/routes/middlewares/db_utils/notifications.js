import r from 'rethinkdb';
import {
  string,
  object,
  array,
  funcWrap,
} from 'valjs';
import db from '../../../../db';
import {
  SwipesError,
} from '../../../../middlewares/swipes-error';

const dbNotificationsMarkAsSeenTs = funcWrap([
  object.as({
    user_id: string.require(),
    timestamp: string.format('iso8601').require(),
  }).require(),
], (err, { user_id, timestamp, timestamp_now }) => {
  if (err) {
    throw new SwipesError(`dbNotificationsMarkAsSeen: ${err}`);
  }

  const q =
    r.table('notifications')
      .getAll(user_id, { index: 'user_id' })
      .filter(r.row('ts').le(timestamp))
      .update({
        seen: new Date().toISOString(),
      });

  return db.rethinkQuery(q);
});
const dbNotificationsMarkAsSeenIds = funcWrap([
  object.as({
    notification_ids: array.require(),
  }).require(),
], (err, { notification_ids }) => {
  if (err) {
    throw new SwipesError(`dbNotificationsMarkAsSeenIds: ${err}`);
  }

  const q = r.table('notifications').getAll(r.args(notification_ids)).update({
    seen: r.now(),
  });

  return db.rethinkQuery(q);
});
const dbNotificationsGetAllByIdOrderByTs = funcWrap([
  object.as({
    user_id: string.require(),
  }).require(),
], (err, { user_id }) => {
  if (err) {
    throw new SwipesError(`dbNotificationsGetAllByIdOrderByTs: ${err}`);
  }

  const q =
    r.table('notifications')
      .getAll(user_id, { index: 'user_id' })
      .orderBy(r.desc('ts'))
      .limit(100);

  return db.rethinkQuery(q);
});

export {
  dbNotificationsMarkAsSeenTs,
  dbNotificationsMarkAsSeenIds,
  dbNotificationsGetAllByIdOrderByTs,
};
