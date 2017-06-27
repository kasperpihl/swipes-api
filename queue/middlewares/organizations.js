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
const organizationsUpdatedNotificationData = (req, res, next) => {
  const {
    organization_id,
    updated_fields,
    organization,
  } = res.locals;
  const updatedData = {};

  updated_fields.forEach((field) => {
    updatedData[field] = organization[field];
  });


  res.locals.notificationData = null;
  res.locals.eventData = {
    ...updatedData,
    organization_id,
    updated_at: organization.updated_at,
  };

  return next();
};

export {
  organizationsGetSingle,
  organizationsUpdatedNotificationData,
};
