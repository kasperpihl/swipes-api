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
    goal,
  } = res.locals;

  const notificationData = {
    title: goal.title,
  };

  res.locals.notificationData = notificationData;
  res.locals.eventData = goal;

  return next();
};

export {
  goalsGetSingle,
  goalsNotificationData,
};
