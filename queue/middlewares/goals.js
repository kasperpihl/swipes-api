import dbGetSingleGoal from '../db_utils/goals';
import {
  getHistoryIndex,
  createNotificationTarget,
} from '../utils';
import {
  SwipesError,
} from '../swipes-error';

const notificationMeta = (goal) => {
  return {
    meta: {
      type: 'goal',
      title: goal.title,
    },
  };
};
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
    group_id,
    goal,
  } = res.locals;
  const historyIndex = getHistoryIndex(goal.history, group_id);

  if (historyIndex === -1) {
    return next(new SwipesError(`goalsCreatedNotificationData - history item with ${group_id} is not found`));
  }

  const target = createNotificationTarget(goal, historyIndex);
  const meta = notificationMeta(goal);
  const notificationData = {
    target,
    meta,
  };

  res.locals.notificationData = notificationData;
  res.locals.eventData = { goal };

  return next();
};
const goalsCompletedNotificationData = (req, res, next) => {
  const {
    group_id,
    goal,
  } = res.locals;
  const historyIndex = getHistoryIndex(goal.history, group_id);

  if (historyIndex === -1) {
    return next(new SwipesError(`goalsCompletedNotificationData - history item with ${group_id} is not found`));
  }

  const target = createNotificationTarget(goal, historyIndex);
  const meta = notificationMeta(goal);
  const notificationData = {
    target,
    meta,
  };

  res.locals.notificationData = notificationData;
  res.locals.eventData = { goal };

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
    group_id,
    goal,
  } = res.locals;
  const historyIndex = getHistoryIndex(goal.history, group_id);

  if (historyIndex === -1) {
    return next(new SwipesError(`goalsArchivedNotificationData - history item with ${group_id} is not found`));
  }

  const target = createNotificationTarget(goal, historyIndex);
  const meta = notificationMeta(goal);
  const notificationData = {
    target,
    meta,
  };

  res.locals.notificationData = notificationData;
  res.locals.eventData = { id: goal.id };

  return next();
};
const goalsMilestoneAddedNotificationData = (req, res, next) => {
  const {
    group_id,
    goal,
  } = res.locals;
  const historyIndex = getHistoryIndex(goal.history, group_id);

  if (historyIndex === -1) {
    return next(new SwipesError(`goalsMilestoneAddedNotificationData - history item with ${group_id} is not found`));
  }

  const target = createNotificationTarget(goal, historyIndex);
  const meta = notificationMeta(goal);
  const notificationData = {
    target,
    meta,
  };

  res.locals.notificationData = notificationData;
  res.locals.eventData = { goal };

  return next();
};
const goalsMilestoneRemovedNotificationData = (req, res, next) => {
  const {
    group_id,
    goal,
  } = res.locals;
  const historyIndex = getHistoryIndex(goal.history, group_id);

  if (historyIndex === -1) {
    return next(new SwipesError(`goalsMilestoneRemovedNotificationData - history item with ${group_id} is not found`));
  }

  const target = createNotificationTarget(goal, historyIndex);
  const meta = notificationMeta(goal);
  const notificationData = {
    target,
    meta,
  };

  res.locals.notificationData = notificationData;
  res.locals.eventData = { goal };

  return next();
};
const goalsStepCompletedNotificationData = (req, res, next) => {
  const {
    group_id,
    goal,
  } = res.locals;
  const historyIndex = getHistoryIndex(goal.history, group_id);

  if (historyIndex === -1) {
    return next(new SwipesError(`goalsStepCompletedNotificationData - history item with ${group_id} is not found`));
  }

  const target = createNotificationTarget(goal, historyIndex);
  const meta = notificationMeta(goal);
  const notificationData = {
    target,
    meta,
  };

  res.locals.notificationData = notificationData;
  res.locals.eventData = { goal };

  return next();
};
const goalsNotifyNotificationData = (req, res, next) => {
  const {
    group_id,
    goal,
  } = res.locals;
  const historyIndex = getHistoryIndex(goal.history, group_id);

  if (historyIndex === -1) {
    return next(new SwipesError(`goalsNotifyNotificationData - history item with ${group_id} is not found`));
  }

  const target = createNotificationTarget(goal, historyIndex);
  const meta = notificationMeta(goal);
  const notificationData = {
    target,
    meta,
  };

  res.locals.notificationData = notificationData;
  res.locals.eventData = { goal };

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
