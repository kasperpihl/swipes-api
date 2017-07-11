import dbGetSingleGoal from '../db_utils/goals';

const goalsGetSingle = (req, res, next) => {
  const {
    goal_id,
  } = res.locals;

  return dbGetSingleGoal({ goal_id })
    .then((goal) => {
      res.locals.goal = goal;

      return next();
    })
    .catch((err) => {
      return next(err);
    });
};
const goalsCreatedNotificationData = (req, res, next) => {
  const {
    goal,
    milestone_id,
    goal_order,
  } = res.locals;

  res.locals.notificationData = null;
  res.locals.eventData = {
    goal,
    milestone_id,
    goal_order,
  };

  return next();
};
const goalsRenamedNotificationData = (req, res, next) => {
  const {
    goal_id,
    title,
  } = res.locals;

  res.locals.notificationData = null;
  res.locals.eventData = {
    goal_id,
    title,
  };

  return next();
};
const goalsLoadedWayNotificationData = (req, res, next) => {
  const {
    goal,
  } = res.locals;

  res.locals.notificationData = null;
  res.locals.eventData = { goal };

  return next();
};
const goalsGeneralNotificationData = (req, res, next) => {
  const {
    goal,
  } = res.locals;

  res.locals.notificationData = null;
  res.locals.eventData = { goal };

  return next();
};
const goalsArchiveNotificationData = (req, res, next) => {
  const {
    goal_id,
    milestone_id,
    goal_order,
  } = res.locals;

  res.locals.notificationData = null;
  res.locals.eventData = { goal_id, milestone_id, goal_order };

  return next();
};

export {
  goalsGetSingle,
  goalsCreatedNotificationData,
  goalsRenamedNotificationData,
  goalsGeneralNotificationData,
  goalsLoadedWayNotificationData,
  goalsArchiveNotificationData,
};
