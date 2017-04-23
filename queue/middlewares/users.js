import {
  dbUsersGetSingleWithOrganizations,
  dbUsersGetMultipleWithFields,
} from '../db_utils/users';

const usersGetSingleWithOrganizations = (req, res, next) => {
  const {
    user_id,
  } = res.locals;

  return dbUsersGetSingleWithOrganizations({ user_id })
    .then((user) => {
      res.locals.user = user;

      return next();
    })
    .catch((err) => {
      return next(err);
    });
};
const usersGetMultipleWithFields = (req, res, next) => {
  const {
    user_ids,
  } = res.locals;
  const fields = [
    'email',
    'profile',
    'settings',
  ];

  return dbUsersGetMultipleWithFields({ user_ids, fields })
    .then((usersWithFields) => {
      res.locals.usersWithFields = usersWithFields;

      return next();
    })
    .catch((err) => {
      return next(err);
    });
};
const usersActivatedNotificationData = (req, res, next) => {
  const {
    user,
  } = res.locals;

  res.locals.notificationData = null;
  res.locals.eventData = { user };

  return next();
};
const usersInvitedNotificationData = (req, res, next) => {
  const {
    user,
    organization,
  } = res.locals;

  res.locals.notificationData = null;
  res.locals.eventData = { user, organization };

  return next();
};

export {
  usersGetSingleWithOrganizations,
  usersGetMultipleWithFields,
  usersActivatedNotificationData,
  usersInvitedNotificationData,
};
