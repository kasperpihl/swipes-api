import r from 'rethinkdb';
import config from 'config';
import request from 'request';
import commonMultipleEvents from '../db_utils/events';
import {
  getHistoryIndex,
} from '../utils';
import {
  dbInsertMultipleNotifications,
} from '../db_utils/notifications';

const oneSignalConfig = config.get('onesignal');

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
      sender: false,
      activity: false,
      ...notificationData,
    };

    userNotificationMap[userId] = {};
    notifications.push(notification);
  });

  if (notifications.length === 0) {
    return next();
  }

  const mappedNotifications = notifications.map((notification) => {
    if (notification.user_id === notification.done_by && !notifyMyself) {
      notification.notification = false;
    }
    if (notification.user_id === notification.done_by && event_type === 'goal_notify') {
      notification.sender = true;
    }
    if (event_type !== 'goal_notify') {
      notification.activity = true;
      notification.seen_at = r.now();
    }

    return notification;
  });

  return dbInsertMultipleNotifications({ notifications: mappedNotifications })
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
const notifyGoalNotifySendPushNotifications = (req, res, next) => {
  const {
    goal,
    user,
    user_ids,
    group_id,
  } = res.locals;
  const historyIndex = getHistoryIndex(goal.history, group_id);
  const history = goal.history[historyIndex];
  const filters = [];

  user_ids.forEach((userId) => {
    if (filters.length > 0) {
      filters.push({
        operator: 'OR',
      });
    }

    filters.push({
      field: 'tag',
      key: 'swipesUserId',
      relation: '=',
      value: userId,
    });
  });

  const message = {
    filters,
    app_id: oneSignalConfig.appId,
    contents: { en: history.message },
    headings: { en: `${user.profile.first_name} notifies you` },
    subtitle: { en: `about ${goal.title}` },
  };
  const reqOptions = {
    url: 'https://onesignal.com/api/v1/notifications',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      Authorization: `Basic ${oneSignalConfig.restKey}`,
    },
    json: message,
  };

  request.post(reqOptions, (error) => {
    if (error) {
      console.log(error);
      return next(error);
    }

    return next();
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
  notifyGoalNotifySendPushNotifications,
};
