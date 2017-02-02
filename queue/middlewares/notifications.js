const notificationsSeenNotificationData = (req, res, next) => {
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

export {
  notificationsSeenNotificationData,
};
