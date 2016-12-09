import {
  dbNotificationsMarkAsSeen,
} from './db_utils/notifications';

const notificationsMarkAsSeen = (req, res, next) => {
  const {
    notification_ids,
  } = res.locals;

  dbNotificationsMarkAsSeen({ notification_ids })
    .then(() => {
      return next();
    })
    .catch((err) => {
      return next(err);
    });
};

export {
  notificationsMarkAsSeen,
};
