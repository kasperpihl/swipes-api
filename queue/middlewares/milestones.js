import dbGetSingleMilestone from '../db_utils/milestones';

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
const milestonesCreatedNotificationData = (req, res, next) => {
  const {
    milestone,
  } = res.locals;

  const notificationData = null;

  res.locals.notificationData = notificationData;
  res.locals.eventData = { milestone };

  return next();
};
const milestonesClosedNotificationData = (req, res, next) => {
  const {
    milestone,
  } = res.locals;

  const notificationData = null;

  res.locals.notificationData = notificationData;
  res.locals.eventData = { id: milestone.id };

  return next();
};

export {
  milestonesGetSingle,
  milestonesCreatedNotificationData,
  milestonesClosedNotificationData,
};
