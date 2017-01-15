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
const goalsNotificationData = (req, res, next) => {
  const {
    user_id,
    goal,
  } = res.locals;

  const notificationData = {
    done_by: user_id,
    goal_id: goal.id,
  };

  res.locals.notificationData = notificationData;
  res.locals.eventData = goal;

  return next();
};

const goalsDeletedNotificationData = (req, res, next) => {
  const {
    user_id,
    goal,
  } = res.locals;

  const notificationData = {
    done_by: user_id,
    goal_id: goal.id,
  };

  res.locals.notificationData = notificationData;
  res.locals.eventData = { id: goal.id };

  return next();
};

const goalsStepCompletedNotificationData = (req, res, next) => {
  const {
    user_id,
    goal,
    completedStepIndex,
  } = res.locals;

  const notificationData = {
    done_by: user_id,
    goal_id: goal.id,
    stepIndex: completedStepIndex,
  };

  res.locals.notificationData = notificationData;
  res.locals.eventData = goal;

  return next();
};

const goalsStepGotActiveNotificationData = (req, res, next) => {
  const {
    goal,
  } = res.locals;

  const notificationData = {
    goal_id: goal.id,
    stepIndex: goal.currentStepIndex,
  };

  res.locals.notificationData = notificationData;
  res.locals.eventData = goal;

  return next();
};

export {
  goalsGetSingle,
  goalsNotificationData,
  goalsDeletedNotificationData,
  goalsStepCompletedNotificationData,
  goalsStepGotActiveNotificationData,
};
