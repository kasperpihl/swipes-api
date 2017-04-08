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

export {
  meSettingsUpdatedNotificationData,
};
