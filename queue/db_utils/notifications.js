import r from 'rethinkdb';
import {
  string,
  number,
  object,
  funcWrap,
} from 'valjs';
import db from '../db';
import {
  SwipesError,
} from '../swipes-error';

const dbInsertMultipleNotifications = ({ notifications }) => {
  const q = r.table('notifications').insert(notifications, {
    returnChanges: true,
  });

  return db.rethinkQuery(q);
};
const dbGetNotificationsTs = funcWrap([
  object.as({
    user_id: string.require(),
    timestamp: string.format('iso8601').require(),
  }).require(),
], (err, { user_id, timestamp }) => {
  if (err) {
    throw new SwipesError(`dbGetNotificationsTs: ${err}`);
  }

  const q =
    r.table('notifications')
      .getAll(user_id, { index: 'user_id' })
      .filter(r.row('created_at').le(timestamp));

  return db.rethinkQuery(q);
});
const dbNotificationTargetHistorySeenByUpdate = funcWrap([
  object.as({
    user_id: string.require(),
    target: object.as({
      id: string.require(),
      history_index: number.int().gte(0).require(),
    }).require(),
  }).require(),
], (err, { user_id, target }) => {
  if (err) {
    // T_TODO why this error is silent?!?!?!
    throw new SwipesError(`dbNotificationTargetSeenByHistoryUpdate: ${err}`);
  }

  let table = '';

  if (target.id.startsWith('G')) {
    table = 'goals';
  }

  const q =
    r.table(table)
      .get(target.id)
      .update({
        history: r.row('history')
          .changeAt(target.history_index,
            r.row('history')
              .nth(target.history_index)
              .merge((item) => {
                return {
                  seen_by: item('seen_by').default([]).setUnion([user_id]),
                };
              }),
          ),
      }, {
        returnChanges: true,
      });

  return db.rethinkQuery(q);
});

export {
  dbInsertMultipleNotifications,
  dbGetNotificationsTs,
  dbNotificationTargetHistorySeenByUpdate,
};
