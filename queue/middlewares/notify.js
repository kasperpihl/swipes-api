import r from 'rethinkdb';
import commonMultipleEvents from '../db_utils/events';
import dbInsertMultipleNotifications from '../db_utils/notifications';

const notifySingleUser = (req, res, next) => {
  const {
    user_id,
  } = res.locals;

  const uniqueUsersToNotify = [user_id];

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
const notifyAllInCurrentStep = (req, res, next) => {
  const {
    goal,
    step_id,
  } = res.locals;

  const currentStep = goal.steps[step_id];
  const usersIds = [];

  currentStep.assignees.forEach((userId) => {
    usersIds.push(userId);
  });

  const uniqueUsersToNotify = Array.from(new Set(usersIds));

  res.locals.uniqueUsersToNotify = uniqueUsersToNotify;

  return next();
};
const notifyCommonRethinkdb = (req, res, next) => {
  const {
    uniqueUsersToNotify,
    event_type,
    userNotificationMap = {},
    notificationData,
    eventData,
  } = res.locals;

  const objToInsert = {
    user_ids: uniqueUsersToNotify,
    type: event_type,
    ts: r.now(),
    data: eventData,
    notification_data: notificationData,
    user_notification_map: userNotificationMap,
  };

  commonMultipleEvents({ objToInsert })
    .then(() => {
      return next();
    })
    .catch((err) => {
      return next(err);
    });
};
const notifyInsertMultipleNotifications = (req, res, next) => {
  const {
    user_id,
    event_type,
    uniqueUsersToNotify,
    notificationData,
  } = res.locals;
  const notifications = [];

  uniqueUsersToNotify.forEach((userId) => {
    notifications.push({
      data: notificationData,
      type: event_type,
      user_id: userId,
      seen: false,
      ts: r.now(),
      me: userId === user_id,
    });
  });

  dbInsertMultipleNotifications({ notifications })
    .then((dbResults) => {
      const userNotificationMap = {};

      dbResults.changes.forEach((change) => {
        const newVal = change.new_val;

        userNotificationMap[newVal.user_id] = {
          id: newVal.id,
          ts: newVal.ts,
        };
      });

      const data = Object.assign({}, {
        data: notificationData,
        type: event_type,
      });

      res.locals.userNotificationMap = userNotificationMap;
      res.locals.notificationData = data;

      return next();
    })
    .catch((err) => {
      return next(err);
    });
};

export {
  notifySingleUser,
  notifyAllInCompany,
  notifyCommonRethinkdb,
  notifyInsertMultipleNotifications,
  notifyAllInCurrentStep,
};
