const stepsAddedNotificationData = (req, res, next) => {
  const {
    goal_id,
    goal_assignees,
    step,
    step_order,
    completed_at,
  } = res.locals;

  res.locals.notificationData = null;
  res.locals.eventData = {
    goal_id,
    goal_assignees,
    step,
    step_order,
    completed_at,
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
    completed_at,
  } = res.locals;

  res.locals.notificationData = null;
  res.locals.eventData = {
    goal_id,
    step_id,
    completed_at,
  };

  return next();
};
const stepsReorderedNotificationData = (req, res, next) => {
  const {
    goal_id,
    step_order,
  } = res.locals;

  res.locals.notificationData = null;
  res.locals.eventData = {
    goal_id,
    step_order,
  };

  return next();
};

export {
  stepsAddedNotificationData,
  stepsRenamedNotificationData,
  stepsDeletedNotificationData,
  stepsReorderedNotificationData,
};
