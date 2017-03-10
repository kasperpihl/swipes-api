import r from 'rethinkdb';
import commonMultipleEvents from '../db_utils/events';
import {
  dbInsertMultipleNotifications,
} from '../db_utils/notifications';

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
const notifyAllInGoal = (req, res, next) => {
  const {
    goal,
  } = res.locals;

  const usersIds = [];

  for (const [k, v] of Object.entries(goal.steps)) {
    v.assignees.forEach((assignee) => {
      usersIds.push(assignee);
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
const notifySendEventToAllInCompany = (req, res, next) => {
  const {
    user,
  } = res.locals;

  const usersIds = [];
  const organization = user.organizations[0];

  organization.users.forEach((userId) => {
    usersIds.push(userId);
  });

  const uniqueUsersToNotifyWithEvent = Array.from(new Set(usersIds));

  res.locals.uniqueUsersToNotifyWithEvent = uniqueUsersToNotifyWithEvent;

  return next();
};
const notifyCommonRethinkdb = (req, res, next) => {
  const {
    uniqueUsersToNotify,
    uniqueUsersToNotifyWithEvent = null,
    event_type,
    userNotificationMap = null,
    eventData,
  } = res.locals;

  const objToInsert = {
    user_ids: uniqueUsersToNotifyWithEvent || uniqueUsersToNotify,
    type: event_type,
    created_at: r.now(),
    data: eventData,
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
const notifyManyToMany = (req, res, next) => {
  const {
    events = [],
  } = res.locals;

  if (events.length === 0) {
    return next();
  }

  return commonMultipleEvents({ objToInsert: events })
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
    group_id,
    event_type,
    uniqueUsersToNotify,
    notificationData,
    interceptUsers,
    interceptNextStepUsers,
    notifyMyself,
  } = res.locals;

  if (notificationData === null) {
    return next();
  }

  const notifications = [];
  const userNotificationMap = {};

  uniqueUsersToNotify.forEach((userId) => {
    const notification = {
      // because mutation is the root of all evil
      // we are mutating the data object few lines down
      group_id,
      id: `${group_id}-${userId}`,
      type: event_type,
      user_id: userId,
      done_by: user_id,
      seen_at: null,
      created_at: r.now(),
      updated_at: r.now(),
      receiver: true,
      ...notificationData,
    };
    let notificationMap = userNotificationMap[userId] || {};
    let important = false;

    if (interceptUsers) {
      important = interceptUsers.has(userId);

      notification.important = important;
      notificationMap = Object.assign({}, notificationMap, { important });
    } else if (interceptNextStepUsers) {
      important = interceptNextStepUsers.has(userId);

      notification.important = important;
      notificationMap = Object.assign({}, notificationMap, { important });
    }

    userNotificationMap[userId] = notificationMap;
    notifications.push(notification);
  });

  if (notifications.length === 0) {
    return next();
  }

  const filteredNotifications = notifications.map((notification) => {
    if (event_type === 'goal_notify') {
      if (notification.user_id !== notification.done_by) {
        notification.important = true;
      }
      if (notification.user_id === notification.done_by && !notifyMyself) {
        notification.receiver = false;
      }
    }
    if (notification.user_id === notification.done_by) {
      notification.sender = true;
    }

    return notification;
  });

  return dbInsertMultipleNotifications({ notifications: filteredNotifications })
    .then((dbResults) => {
      if (!dbResults.changes) {
        return next();
      }

      dbResults.changes.forEach((change) => {
        const newVal = change.new_val;
        let notificationMap = userNotificationMap[newVal.user_id] || {};

        notificationMap = Object.assign({}, notificationMap, {
          ...newVal,
        });

        userNotificationMap[newVal.user_id] = notificationMap;
      });

      res.locals.userNotificationMap = userNotificationMap;

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
  notifySendEventToAllInCompany,
  notifyManyToMany,
};
