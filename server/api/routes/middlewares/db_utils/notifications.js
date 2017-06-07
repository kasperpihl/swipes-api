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

const dbNotificationsMarkAsSeen = funcWrap([
  object.as({
    notification_ids: array.require(),
  }).require(),
], (err, { notification_ids, timestamp_now }) => {
  if (err) {
    throw new SwipesError(`dbNotificationsMarkAsSeen: ${err}`);
  }

  const q = r.table('notifications').getAll(r.args(notification_ids)).update({
    seen_at: timestamp_now,
    updated_at: r.now(),
  });

  return db.rethinkQuery(q);
});
const dbNotificationsGetAllByIdOrderByTs = funcWrap([
  object.as({
    user_id: string.require(),
    filter: object.require(),
    timestamp: string.format('iso8601').require(),
  }).require(),
], (err, {
  user_id, filter = {},
  filterDefaultOption,
  timestamp,
}) => {
  if (err) {
    throw new SwipesError(`dbNotificationsGetAllByIdOrderByTs: ${err}`);
  }

  const q =
    r.table('notifications')
      .getAll(user_id, { index: 'user_id' })
      .filter((notification) => {
        return notification('updated_at').during(r.ISO8601(timestamp).sub(3600), r.now().add(3600));
      })
      .filter(filter, { default: filterDefaultOption })
      .orderBy(r.desc('updated_at'))
      .limit(100);

  return db.rethinkQuery(q);
});

export {
  dbNotificationsMarkAsSeen,
  dbNotificationsGetAllByIdOrderByTs,
};
