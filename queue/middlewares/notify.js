import r from 'rethinkdb';
import config from 'config';
import request from 'request';
import commonMultipleEvents from '../db_utils/events';
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

  if (eventData === null) {
    return next();
  }

  const objToInsert = {
    user_ids: uniqueUsersToNotifyWithEvent || uniqueUsersToNotify,
    type: event_type,
    created_at: r.now(),
    data: eventData,
    user_notification_map: userNotificationMap,
  };

  return commonMultipleEvents({ objToInsert })
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
    notification_id_sufix,
    event_type,
    uniqueUsersToNotify,
    notificationData,
    usersNotificationDataMetaMap = {},
  } = res.locals;

  if (notificationData === null) {
    return next();
  }

  if (notificationData.meta) {
    notificationData.meta.event_type = event_type;
  }

  const notifications = [];
  const userNotificationMap = {};

  uniqueUsersToNotify.forEach((userId) => {
    if (usersNotificationDataMetaMap[userId]) {
      notificationData.meta = {
        ...notificationData.meta,
        ...usersNotificationDataMetaMap[userId],
      };
    }

    const notification = {
      // because mutation is the root of all evil
      // we are mutating the data object few lines down
      id: `${userId}-${notification_id_sufix}`,
      user_id: userId,
      seen_at: null,
      created_at: r.now(),
      updated_at: r.now(),
      ...notificationData,
    };

    userNotificationMap[userId] = {};
    notifications.push(notification);
  });

  if (notifications.length === 0) {
    return next();
  }

  return dbInsertMultipleNotifications({ notifications })
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
const notifySendPushNotification = (req, res, next) => {
  const {
    pushMessage,
    pushTargetId,
    user_ids,
    organization_id,
  } = res.locals;
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

  const message = Object.assign({}, pushMessage, {
    filters,
    app_id: oneSignalConfig.appId,
    // contents: { en: history.message },
    // headings: { en: headingsMessage },
    // subtitle: { en: `about ${goal.title}` },
    data: {
      organization_id,
      group_id: 'swipesAndroid',
      target_id: pushTargetId,
    },
    priority: 10,
    content_available: true,
    android_visibility: 0,
  });

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
  notifySendPushNotification,
};
