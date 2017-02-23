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
const notifyMultipleUsers = (req, res, next) => {
  const {
    user_ids,
  } = res.locals;

  const uniqueUsersToNotify = user_ids;

  res.locals.uniqueUsersToNotify = uniqueUsersToNotify;

  return next();
};
const notifyAllInCompany = (req, res, next) => {
  const {
    user,
    user_id,
  } = res.locals;

  const usersIds = [];
  const organization = user.organizations[0];

  organization.users.forEach((userId) => {
    if (user_id !== userId) {
      usersIds.push(userId);
    }
  });

  const uniqueUsersToNotify = Array.from(new Set(usersIds));

  res.locals.uniqueUsersToNotify = uniqueUsersToNotify;

  return next();
};
const notifyAllInGoal = (req, res, next) => {
  const {
    goal,
    user_id,
  } = res.locals;

  const usersIds = [];

  for (const [k, v] of Object.entries(goal.steps)) {
    v.assignees.forEach((assignee) => {
      if (user_id !== assignee) {
        usersIds.push(assignee);
      }
    });
  }

  const uniqueUsersToNotify = Array.from(new Set(usersIds));

  res.locals.uniqueUsersToNotify = uniqueUsersToNotify;

  return next();
};
const notifyAllInCurrentStep = (req, res, next) => {
  const {
    goal,
    step_id,
    user_id,
  } = res.locals;

  const currentStep = goal.steps[step_id];
  const usersIds = [];

  currentStep.assignees.forEach((userId) => {
    if (user_id !== userId) {
      usersIds.push(userId);
    }
  });

  const uniqueUsersToNotify = Array.from(new Set(usersIds));

  res.locals.uniqueUsersToNotify = uniqueUsersToNotify;

  return next();
};
const notifyCommonRethinkdb = (req, res, next) => {
  const {
    uniqueUsersToNotify,
    event_type,
    userNotificationMap = null,
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
    event_type,
    uniqueUsersToNotify,
    notificationData,
    interceptUsers,
    interceptNextStepUsers,
  } = res.locals;
  const notifications = [];
  const userNotificationMap = {};


  uniqueUsersToNotify.forEach((userId) => {
    const notification = {
      // because mutation is the root of all evil
      // we are mutating the data object few lines down
      data: { ...notificationData },
      type: event_type,
      user_id: userId,
      seen: false,
      ts: r.now(),
    };
    let notificationMap = userNotificationMap[userId] || {};

    if (interceptUsers) {
      const includes_me = interceptUsers.has(userId);

      notification.data.includes_me = includes_me;
      notificationMap = Object.assign({}, notificationMap, { includes_me });
    }

    if (interceptNextStepUsers) {
      const me_is_next = interceptNextStepUsers.has(userId);

      notification.data.me_is_next = me_is_next;
      notificationMap = Object.assign({}, notificationMap, { me_is_next });
    }

    userNotificationMap[userId] = notificationMap;
    notifications.push(notification);
  });

  dbInsertMultipleNotifications({ notifications })
    .then((dbResults) => {
      dbResults.changes.forEach((change) => {
        const newVal = change.new_val;
        let notificationMap = userNotificationMap[newVal.user_id] || {};

        notificationMap = Object.assign({}, notificationMap, {
          id: newVal.id,
          ts: newVal.ts,
        });

        userNotificationMap[newVal.user_id] = notificationMap;
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
  notifyAllInGoal,
  notifyAllInCurrentStep,
  notifyMultipleUsers,
};
