import r from 'rethinkdb';
import {
  string,
  object,
  array,
  funcWrap,
} from 'valjs';
import db from '../db';
import {
  SwipesError,
} from '../swipes-error';

const dbInsertMultipleNotifications = ({ notifications }) => {
  const q = r.table('notifications').insert(notifications, {
    returnChanges: true,
    conflict: 'replace',
  });

  return db.rethinkQuery(q);
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

  return db.rethinkQuery(q);
});

export {
  dbInsertMultipleNotifications,
  dbGetNotificationsIds,
};
