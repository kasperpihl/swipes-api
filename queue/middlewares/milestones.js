import dbGetSingleMilestone from '../db_utils/milestones';
import {
  getHistoryIndex,
  createNotificationTarget,
} from '../utils';
import {
  SwipesError,
} from '../swipes-error';

const notificationMeta = (milestone) => {
  return {
    type: 'milestone',
    title: milestone.title,
  };
};
const milestonesGetSingle = (req, res, next) => {
  const {
    milestone_id,
  } = res.locals;

  return dbGetSingleMilestone({ milestone_id })
    .then((milestone) => {
      res.locals.milestone = milestone;

      return next();
    })
    .catch((err) => {
      return next(err);
    });
};
const milestonesGoalAddedRemovedNotificationData = (req, res, next) => {
  const {
    goal_id,
    milestone_id,
    goal_order,
    // when we are removing a goal from a milestone there is no old_milestone_id
    old_milestone_id = null,
  } = res.locals;

  res.locals.notificationData = null;
  res.locals.eventData = { goal_id, milestone_id, old_milestone_id, goal_order };

  return next();
};
const milestonesGeneralWithHistoryNotificationData = (req, res, next) => {
  const {
    milestone,
  } = res.locals;

  res.locals.notificationData = null;
  res.locals.eventData = { milestone };

  return next();
};
const milestoneOpenCloseWithHistoryNotificationData = (req, res, next) => {
  const {
    milestone,
    milestone_id,
    goal_ids,
  } = res.locals;

  res.locals.notificationData = null;
  res.locals.eventData = {
    milestone_id,
    closed_at: milestone.closed_at,
    goal_order: milestone.goal_order,
    goal_ids,
  };

  return next();
};
const milestonesRenamedNotificationData = (req, res, next) => {
  const {
    milestone_id,
    title,
  } = res.locals;

  res.locals.notificationData = null;
  res.locals.eventData = {
    milestone_id,
    title,
  };

  return next();
};
const milestonesGoalsReorderedNotificationData = (req, res, next) => {
  const {
    milestone_id,
    goal_order,
  } = res.locals;

  res.locals.notificationData = null;
  res.locals.eventData = {
    milestone_id,
    goal_order,
  };

  return next();
};

export {
  milestonesGetSingle,
  milestonesGeneralWithHistoryNotificationData,
  milestonesGoalAddedRemovedNotificationData,
  milestoneOpenCloseWithHistoryNotificationData,
  milestonesRenamedNotificationData,
  milestonesGoalsReorderedNotificationData,
};
