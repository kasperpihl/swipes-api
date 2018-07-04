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
    user_id,
    profile,
  } = res.locals;

  const notificationData = null;

  res.locals.notificationData = notificationData;
  res.locals.eventData = {
    user_id,
    profile,
  };

  return next();
};

export {
  meSettingsUpdatedNotificationData,
  meProfileUpdatedNotificationData,
};
