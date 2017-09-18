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

export {
  organizationsGetSingle,
  organizationsCreatedUpdatedNotificationData,
};
