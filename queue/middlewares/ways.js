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
    user_id,
    way,
  } = res.locals;

  const notificationData = {
    done_by: user_id,
    way_id: way.id,
  };

  res.locals.notificationData = notificationData;
  res.locals.eventData = way;

  return next();
};
const waysDeletedNotificationData = (req, res, next) => {
  const {
    user_id,
    way,
  } = res.locals;

  const notificationData = {
    done_by: user_id,
    way_id: way.id,
  };

  res.locals.notificationData = notificationData;
  res.locals.eventData = { id: way.id };

  return next();
};

export {
  waysGetSingle,
  waysCreatedNotificationData,
  waysDeletedNotificationData,
};
