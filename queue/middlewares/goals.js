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
const goalsAssignedNotificationData = (req, res, next) => {
  const {
    goal_id,
    goal,
    assignees,
  } = res.locals;

  res.locals.notificationData = {
    target: {
      id: goal_id,
    },
    meta: {
      goal_title: goal.title,
    },
  };
  res.locals.eventData = {
    goal_id,
    assignees,
    steps: goal.steps,
  };

  return next();
};
const goalsAssignedUsersNotificationDataMap = (req, res, next) => {
  const {
    goal,
    assignees_diff,
  } = res.locals;
  const usersNotificationDataMetaMap = {};

  assignees_diff.forEach((assigneeId) => {
    let step_assign_count = 0;

    goal.step_order.forEach((stepId) => {
      if (goal.steps[stepId].assignees.includes(assigneeId)) {
        step_assign_count += 1;
      }
    });

    usersNotificationDataMetaMap[assigneeId] = {
      step_assign_count,
    };

    step_assign_count = 0;
  });

  res.locals.usersNotificationDataMetaMap = usersNotificationDataMetaMap;

  return next();
};

export {
  goalsGetSingle,
  goalsCreatedNotificationData,
  goalsRenamedNotificationData,
  goalsGeneralNotificationData,
  goalsLoadedWayNotificationData,
  goalsArchiveNotificationData,
  goalsAssignedNotificationData,
  goalsAssignedUsersNotificationDataMap,
};
