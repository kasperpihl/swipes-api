const attachmentsAddedNotificationData = (req, res, next) => {
  const {
    target_id,
    attachment,
    attachment_order,
  } = res.locals;

  res.locals.notificationData = null;
  res.locals.eventData = {
    target_id,
    attachment,
    attachment_order,
  };

  return next();
};
const attachmentsRenamedNotificationData = (req, res, next) => {
  const {
    target_id,
    attachment_id,
    title,
  } = res.locals;

  res.locals.notificationData = null;
  res.locals.eventData = {
    target_id,
    attachment_id,
    title,
  };

  return next();
};
const attachmentsDeletedNotificationData = (req, res, next) => {
  const {
    target_id,
    attachment_id,
  } = res.locals;

  res.locals.notificationData = null;
  res.locals.eventData = {
    target_id,
    attachment_id,
  };

  return next();
};
const attachmentsReorderedNotificationData = (req, res, next) => {
  const {
    target_id,
    attachment_order,
  } = res.locals;

  res.locals.notificationData = null;
  res.locals.eventData = {
    target_id,
    attachment_order,
  };

  return next();
};

export {
  attachmentsAddedNotificationData,
  attachmentsRenamedNotificationData,
  attachmentsDeletedNotificationData,
  attachmentsReorderedNotificationData,
};
