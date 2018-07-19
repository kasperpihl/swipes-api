import r from 'rethinkdb';
import {
  object,
  array,
  funcWrap,
} from 'valjs';
import dbRunQuery from 'src/utils/db/dbRunQuery';
import SwipesError from 'src/utils/SwipesError';

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

  return dbRunQuery(q);
});

export {
  dbNotificationsMarkAsSeen,
};
