import {
  dbGetNotificationsIds,
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
};
