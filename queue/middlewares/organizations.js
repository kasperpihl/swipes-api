import dbOrganizationsGetSingle from '../db_utils/organizations';

const organizationsGetSingle = (req, res, next) => {
  const {
    organization_id,
  } = res.locals;

  return dbOrganizationsGetSingle({ organization_id })
    .then((organization) => {
      res.locals.organization = organization;

      return next();
    })
    .catch((err) => {
      return next(err);
    });
};
const organizationsCreatedUpdatedNotificationData = (req, res, next) => {
  const {
    organization,
  } = res.locals;


  res.locals.notificationData = null;
  res.locals.eventData = {
    organization,
  };

  return next();
};
const organizationsUsersInvitedNotificationData = (req, res, next) => {
  const {
    user,
    organization,
  } = res.locals;

  res.locals.notificationData = null;
  res.locals.eventData = { user, organization };

  return next();
};
const organizationsDeletedNotificationData = (req, res, next) => {
  const {
    organization_id,
  } = res.locals;

  res.locals.notificationData = null;
  res.locals.eventData = { organization_id };

  return next();
};
const organizationsUserJoinedNotificationData = (req, res, next) => {
  const {
    user_id,
    userWithFields,
  } = res.locals;

  res.locals.notificationData = {
    target: {
      id: user_id,
    },
    meta: {
      first_name: userWithFields.profile.first_name,
    },
  };
  res.locals.eventData = null;

  return next();
};

export {
  organizationsGetSingle,
  organizationsCreatedUpdatedNotificationData,
  organizationsUsersInvitedNotificationData,
  organizationsDeletedNotificationData,
  organizationsUserJoinedNotificationData,
};
