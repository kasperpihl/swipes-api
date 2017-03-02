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
    user_id,
    goal,
  } = res.locals;

  const notificationData = {
    done_by: user_id,
    goal_id: goal.id,
    flags: goal.history[0].flags,
    message: goal.history[0].message,
  };

  res.locals.notificationData = notificationData;
  res.locals.eventData = goal;

  return next();
};
const goalsCompletedNotificationData = (req, res, next) => {
  const {
    user_id,
    goal,
  } = res.locals;

  const notificationData = {
    done_by: user_id,
    goal_id: goal.id,
    flags: goal.status.flags,
    message: goal.status.handoff_message,
  };

  res.locals.notificationData = notificationData;
  res.locals.eventData = goal;

  return next();
};
const goalsStepsInterseptUsers = (req, res, next) => {
  const {
    goal,
    interceptUsers = [],
  } = res.locals;
  let additionalInterceptUsers = [];

  for (const [k, v] of Object.entries(goal.steps)) {
    additionalInterceptUsers = additionalInterceptUsers.concat(v.assignees);
  }

  res.locals.interceptUsers = new Set([...additionalInterceptUsers, ...interceptUsers]);

  return next();
};
const goalsNextStepInterseptUsers = (req, res, next) => {
  const {
    goal,
    next_step_id,
    interceptNextStepUsers = [],
  } = res.locals;
  const nextStep = goal.steps[next_step_id];
  const additionalInterceptNextStepUsers = [];

  if (nextStep.assignees) {
    nextStep.assignees.forEach((assignee) => {
      additionalInterceptNextStepUsers.push(assignee);
    });
  }

  res.locals.interceptNextStepUsers = new Set([
    ...additionalInterceptNextStepUsers,
    ...interceptNextStepUsers,
  ]);

  return next();
};
const goalsHistoryInterseptUsers = (req, res, next) => {
  const {
    goal,
    interceptUsers = [],
  } = res.locals;
  const additionalInterceptUsers = [];

  goal.history.forEach((item) => {
    if (item.assignees && item.assignees.length > 0) {
      item.assignees.forEach((assignee) => {
        additionalInterceptUsers.push(assignee);
      });
    }
  });

  res.locals.interceptUsers = new Set([...additionalInterceptUsers, ...interceptUsers]);

  return next();
};
const goalsArchivedNotificationData = (req, res, next) => {
  const {
    user_id,
    goal,
  } = res.locals;

  const notificationData = {
    done_by: user_id,
    goal_id: goal.id,
    goal_title: goal.title,
  };

  res.locals.notificationData = notificationData;
  res.locals.eventData = { id: goal.id };

  return next();
};
const goalsMilestoneAddedNotificationData = (req, res, next) => {
  const {
    user_id,
    goal,
  } = res.locals;

  const notificationData = {
    done_by: user_id,
    goal_id: goal.id,
    milestone_id: goal.milestone_id,
  };

  res.locals.notificationData = notificationData;
  res.locals.eventData = goal;

  return next();
};
const goalsMilestoneRemovedNotificationData = (req, res, next) => {
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
const goalsStepCompletedNotificationData = (req, res, next) => {
  const {
    user_id,
    goal,
    step_id,
    next_step_id,
    progress,
  } = res.locals;

  const notificationData = {
    step_id,
    progress,
    next_step_id,
    done_by: user_id,
    goal_id: goal.id,
    flags: goal.status.flags,
    message: goal.status.handoff_message,
  };

  res.locals.notificationData = notificationData;
  res.locals.eventData = goal;

  return next();
};
const goalsNotifyNotificationData = (req, res, next) => {
  const {
    user_id,
    goal_id,
    user_ids,
    flags,
    message,
    feedback = false,
    goal,
  } = res.locals;

  const notificationData = {
    goal_id,
    message,
    feedback,
    flags,
    assignees: user_ids,
    done_by: user_id,
  };

  res.locals.notificationData = notificationData;
  res.locals.eventData = goal;

  return next();
};

export {
  goalsGetSingle,
  goalsCreatedNotificationData,
  goalsCompletedNotificationData,
  goalsStepsInterseptUsers,
  goalsNextStepInterseptUsers,
  goalsHistoryInterseptUsers,
  goalsArchivedNotificationData,
  goalsStepCompletedNotificationData,
  goalsMilestoneAddedNotificationData,
  goalsMilestoneRemovedNotificationData,
  goalsNotifyNotificationData,
};
