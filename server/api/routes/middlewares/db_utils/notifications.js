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
        seen_at: new Date().toISOString(),
      });

  return db.rethinkQuery(q);
});
const dbNotificationsMarkAsSeenIds = funcWrap([
  object.as({
    notification_ids: array.require(),
  }).require(),
], (err, { notification_ids, timestamp_now }) => {
  if (err) {
    throw new SwipesError(`dbNotificationsMarkAsSeenIds: ${err}`);
  }

  const q = r.table('notifications').getAll(r.args(notification_ids)).update({
    seen_at: timestamp_now,
  });

  return db.rethinkQuery(q);
});
const dbNotificationsGetAllByIdOrderByTs = funcWrap([
  object.as({
    user_id: string.require(),
    filter: object.require(),
  }).require(),
], (err, { user_id, filter = {}, filterDefaultOption }) => {
  if (err) {
    throw new SwipesError(`dbNotificationsGetAllByIdOrderByTs: ${err}`);
  }

  const q =
    r.table('notifications')
      .getAll(user_id, { index: 'user_id' })
      .filter(filter, { default: filterDefaultOption })
      .orderBy(r.desc('updated_at'))
      .limit(100);

  return db.rethinkQuery(q);
});

export {
  dbNotificationsMarkAsSeenTs,
  dbNotificationsMarkAsSeenIds,
  dbNotificationsGetAllByIdOrderByTs,
};
