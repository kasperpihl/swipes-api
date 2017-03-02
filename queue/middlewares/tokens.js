const tokensRevokedNotificationData = (req, res, next) => {
  const {
    token_to_revoke,
  } = res.locals;

  const notificationData = {};

  res.locals.notificationData = notificationData;
  res.locals.eventData = {
    token_to_revoke,
  };

  return next();
};

export {
  tokensRevokedNotificationData,
};
