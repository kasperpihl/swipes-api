import {
  string,
  array,
  object,
} from 'valjs';
import {
  commonMultipleEvents,
} from './db_utils/events';
import {
  valLocals,
} from '../../utils';

const notifyAllInCompany = valLocals('notifyAllInCompany', {
  user: object.require(),
}, (req, res, next, setLocals) => {
  const {
    user,
  } = res.locals;

  const usersIds = [];
  const organization = user.organizations[0];

  organization.users.forEach((userId) => {
    usersIds.push(userId);
  });

  const uniqueUsersToNotify = Array.from(new Set(usersIds));

  setLocals({
    uniqueUsersToNotify,
  });

  return next();
});

const notifyCommonRethinkdb = valLocals('notifyCommonRethinkdb', {
  uniqueUsersToNotify: array.of(string).require(),
  eventType: string.require(),
  eventData: object.require(),
}, (req, res, next) => {
  const {
    uniqueUsersToNotify,
    eventType,
    eventData,
  } = res.locals;

  const date = new Date();
  const type = eventType;

  const objToInsert = {
    user_ids: uniqueUsersToNotify,
    date,
    type,
    data: eventData,
  };

  commonMultipleEvents({ objToInsert })
    .then(() => {
      return next();
    })
    .catch((err) => {
      return next(err);
    });
});

export {
  notifyAllInCompany,
  notifyCommonRethinkdb,
};
