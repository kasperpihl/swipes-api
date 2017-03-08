const notificationsSeenTsNotificationData = (req, res, next) => {
  const {
    marked_at,
    last_marked,
  } = res.locals;

  const notificationData = null;

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
  notificationsSeenTsNotificationData,
  notificationsSeenIdsNotificationData,
};
