const notificationsSeenTsNotificationData = (req, res, next) => {
  const {
    marked_at,
    last_marked,
  } = res.locals;

  const notificationData = {};

  res.locals.notificationData = notificationData;
  res.locals.eventData = {
    marked_at,
    last_marked,
  };

  return next();
};

const notificationsSeenIdsNotificationData = (req, res, next) => {
  const {
    notification_ids,
  } = res.locals;

  const notificationData = {};

  res.locals.notificationData = notificationData;
  res.locals.eventData = {
    notification_ids,
  };

  return next();
};

export {
  notificationsSeenTsNotificationData,
  notificationsSeenIdsNotificationData,
};
