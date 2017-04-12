const meSettingsUpdatedNotificationData = (req, res, next) => {
  const {
    settings,
  } = res.locals;

  const notificationData = null;

  res.locals.notificationData = notificationData;
  res.locals.eventData = {
    settings,
  };

  return next();
};
const meProfileUpdatedNotificationData = (req, res, next) => {
  const {
    profile,
  } = res.locals;

  const notificationData = null;

  res.locals.notificationData = notificationData;
  res.locals.eventData = {
    profile,
  };

  return next();
};

export {
  meSettingsUpdatedNotificationData,
  meProfileUpdatedNotificationData,
};
