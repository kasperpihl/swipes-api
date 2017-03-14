const stepsAddedNotificationData = (req, res, next) => {
  const {
    goal_id,
    step,
    step_order,
  } = res.locals;

  res.locals.notificationData = null;
  res.locals.eventData = {
    goal_id,
    step,
    step_order,
  };

  return next();
};
const stepsRenamedNotificationData = (req, res, next) => {
  const {
    goal_id,
    step_id,
    title,
  } = res.locals;

  res.locals.notificationData = null;
  res.locals.eventData = {
    goal_id,
    step_id,
    title,
  };

  return next();
};
const stepsDeletedNotificationData = (req, res, next) => {
  const {
    goal_id,
    step_id,
  } = res.locals;

  res.locals.notificationData = null;
  res.locals.eventData = {
    goal_id,
    step_id,
  };

  return next();
};
const stepsReorderedNotificationData = (req, res, next) => {
  const {
    goal_id,
    step_order,
    status,
  } = res.locals;

  res.locals.notificationData = null;
  res.locals.eventData = {
    goal_id,
    step_order,
    status,
  };

  return next();
};
const stepsAssignedNotificationData = (req, res, next) => {
  const {
    goal_id,
    step_id,
    assignees,
  } = res.locals;

  res.locals.notificationData = null;
  res.locals.eventData = {
    goal_id,
    step_id,
    assignees,
  };

  return next();
};

export {
  stepsAddedNotificationData,
  stepsRenamedNotificationData,
  stepsDeletedNotificationData,
  stepsReorderedNotificationData,
  stepsAssignedNotificationData,
};
