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
    type: 'goal',
    title: goal.title,
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
    goal,
  } = res.locals;
  console.log(goal);

  res.locals.notificationData = null;
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
const goalsNotifyAddSenderAlways = (req, res, next) => {
  const {
    user_id,
    user_ids,
  } = res.locals;

  if (user_ids.indexOf(user_id) > -1) {
    res.locals.notifyMyself = true;
  }

  res.locals.user_ids = [...new Set([...[user_id], ...user_ids])];

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
const goalsGeneralWithHistoryNotificationData = (req, res, next) => {
  const {
    group_id,
    goal,
  } = res.locals;
  const historyIndex = getHistoryIndex(goal.history, group_id);

  if (historyIndex === -1) {
    return next(new SwipesError(`goalsGeneralNotificationData - history item with ${group_id} is not found`));
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
  goalsStepsInterseptUsers,
  goalsNextStepInterseptUsers,
  goalsHistoryInterseptUsers,
  goalsNotifyAddSenderAlways,
  goalsRenamedNotificationData,
  goalsGeneralWithHistoryNotificationData,
  goalsLoadedWayNotificationData,
};
