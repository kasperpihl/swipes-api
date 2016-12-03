import {
  commonMultipleEvents,
} from './db_utils/events';

const notifyAllInGoal = (req, res, next) => {
  const {
    goal,
  } = res.locals;

  const assignees = [];
  const steps = goal.steps;

  steps.forEach((step) => {
    step.assignees.forEach((assignee) => {
      assignees.push(assignee);
    });
  });

  const uniqueUsersToNotify = Array.from(new Set(assignees));

  res.locals.uniqueUsersToNotify = uniqueUsersToNotify;

  return next();
};

const notifyAllInCompany = (req, res, next) => {
  const {
    user,
  } = res.locals;

  const usersIds = [];
  const organization = user.organizations[0];

  organization.users.forEach((userId) => {
    usersIds.push(userId);
  });

  const uniqueUsersToNotify = Array.from(new Set(usersIds));

  res.locals.uniqueUsersToNotify = uniqueUsersToNotify;

  return next();
};

const notifyCommonRethinkdb = (req, res, next) => {
  const {
    uniqueUsersToNotify,
    eventType,
    eventMessage,
    eventData,
  } = res.locals;

  const date = new Date();
  const type = eventType;
  const message = eventMessage || '';

  const objToInsert = {
    user_ids: uniqueUsersToNotify,
    date,
    type,
    message,
    data: eventData,
  };

  commonMultipleEvents({ objToInsert })
    .then(() => {
      return next();
    })
    .catch((err) => {
      console.log(err);
      return next(err);
    });
};

export {
  notifyAllInGoal,
  notifyAllInCompany,
  notifyCommonRethinkdb,
};
