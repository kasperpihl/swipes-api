import dbGetSingleWay from '../db_utils/ways';

const waysGetSingle = (req, res, next) => {
  const {
    way_id,
  } = res.locals;

  return dbGetSingleWay({ way_id })
    .then((way) => {
      res.locals.way = way;

      return next();
    })
    .catch((err) => {
      return next(err);
    });
};
const waysCreatedNotificationData = (req, res, next) => {
  const {
    way,
  } = res.locals;

  const notificationData = null;

  res.locals.notificationData = notificationData;
  res.locals.eventData = { way };

  return next();
};
const waysArchivedNotificationData = (req, res, next) => {
  const {
    way,
  } = res.locals;

  const notificationData = null;

  res.locals.notificationData = notificationData;
  res.locals.eventData = { id: way.id };

  return next();
};

export {
  waysGetSingle,
  waysCreatedNotificationData,
  waysArchivedNotificationData,
};
