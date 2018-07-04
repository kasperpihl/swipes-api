import r from 'rethinkdb';
import {
  string,
  object,
  array,
  funcWrap,
} from 'valjs';
import dbRunQuery from 'src/utils/db/dbRunQuery';
import SwipesError from 'src/utils/SwipesError';

const dbInsertMultipleNotifications = ({ notifications }) => {
  const q = r.table('notifications').insert(notifications, {
    returnChanges: true,
    conflict: 'replace',
  });

  return dbRunQuery(q);
};
const dbGetNotificationsIds = funcWrap([
  object.as({
    user_id: string.require(),
    notification_ids: array.require(),
  }).require(),
], (err, { user_id, notification_ids }) => {
  if (err) {
    throw new SwipesError(`dbGetNotificationsIds: ${err}`);
  }

  const q =
    r.table('notifications')
      .getAll(...notification_ids);

  return dbRunQuery(q);
});

export {
  dbInsertMultipleNotifications,
  dbGetNotificationsIds,
};
