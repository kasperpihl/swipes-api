const stepsAddedNotificationData = (req, res, next) => {
  const {
    goal_id,
    step,
    step_order,
    completed_at,
  } = res.locals;

  res.locals.notificationData = null;
  res.locals.eventData = {
    goal_id,
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
const stepsAssignedNotificationData = (req, res, next) => {
  const {
    goal_id,
    goal,
    step_id,
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
    step_id,
    assignees,
  };

  return next();
};
const stepsAssignedUsersNotificationDataMap = (req, res, next) => {
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
  stepsAddedNotificationData,
  stepsRenamedNotificationData,
  stepsDeletedNotificationData,
  stepsReorderedNotificationData,
  stepsAssignedNotificationData,
  stepsAssignedUsersNotificationDataMap,
};
