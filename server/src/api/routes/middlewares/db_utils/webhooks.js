import r from 'rethinkdb';
import {
  string,
  object,
  array,
  funcWrap,
} from 'valjs';
import dbRunQuery from 'src/utils/db/dbRunQuery';
import {
  SwipesError,
} from '../../../../middlewares/swipes-error';

const dropboxGetAuthDataByAccounts = funcWrap([
  object.as({
    accounts: array.require(),
  }).require(),
], (err, { accounts }) => {
  if (err) {
    throw new SwipesError(`dropboxGetAuthDataByAccounts: ${err}`);
  }

  const q = r.table('users')
    .concatMap((user) => {
      return user('services').merge({ user_id: user('id') });
    }).filter((service) => {
      return r.contains(accounts, service('id'));
    });

  return dbRunQuery(q);
});
const asanaGetAuthDataByAccountId = funcWrap([
  object.as({
    accountId: string.require(),
  }).require(),
], (err, { accountId }) => {
  if (err) {
    throw new SwipesError(`asanaGetAuthDataByAccountId: ${err}`);
  }

  const q = r.table('users')
    .concatMap((user) => {
      return user('services').merge({ user_id: user('id') });
    }).filter((service) => {
      return service('id').eq(accountId);
    });

  return dbRunQuery(q);
});

export {
  dropboxGetAuthDataByAccounts,
  asanaGetAuthDataByAccountId,
};
