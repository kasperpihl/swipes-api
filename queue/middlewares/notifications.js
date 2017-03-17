import r from 'rethinkdb';
import Promise from 'bluebird';
import {
  dbGetNotificationsIds,
  dbNotificationTargetHistorySeenByUpdate,
} from '../db_utils/notifications';

const notificationsGetIds = (req, res, next) => {
  const {
    user_id,
    notification_ids,
  } = res.locals;

  dbGetNotificationsIds({ user_id, notification_ids })
    .then((notifications) => {
      res.locals.notifications = notifications;

      return next();
    })
    .catch((err) => {
      return next(err);
    });
};
const noticationsUpdateTargetHistory = (req, res, next) => {
  const {
    user_id,
    notifications = [],
  } = res.locals;
  const promiseArrayQ = [];

  notifications.forEach((notification) => {
    promiseArrayQ.push(dbNotificationTargetHistorySeenByUpdate({
      user_id,
      target: notification.target,
    }));
  });

  Promise.all(promiseArrayQ)
    .then((results) => {
      const events = [];

      results.filter((result) => {
        return result.changes && result.changes.length > 0;
      }).forEach((result, idx) => {
        const target = notifications[idx].target;

        events.push({
          // we can use idx here because the order of the results should be same as notifications
          user_ids: [notifications[idx].done_by],
          type: 'history_updated',
          created_at: r.now(),
          data: {
            target,
            changes: result.changes[0].new_val.history[target.history_index],
          },
        });
      });

      res.locals.events = events;

      return next();
    })
    .catch((err) => {
      return next(err);
    });
};
const notificationsSeenNotificationData = (req, res, next) => {
  const {
    notification_ids,
    last_marked,
  } = res.locals;

  const notificationData = null;

  res.locals.notificationData = notificationData;
  res.locals.eventData = {
    notification_ids,
    last_marked,
  };

  return next();
};

export {
  notificationsGetIds,
  notificationsSeenNotificationData,
  noticationsUpdateTargetHistory,
};
