import r from 'rethinkdb';
import {
  string,
  object,
  funcWrap,
} from 'valjs';
import dbRunQuery from 'src/utils/db/dbRunQuery';
import {
  SwipesError,
} from '../../../../middlewares/swipes-error';

const dbCheckToken = funcWrap([
  object.as({
    user_id: string.require(),
    token: string.require(),
  }).require(),
], (err, { user_id, token }) => {
  if (err) {
    throw new SwipesError(`dbCheckToken: ${err}`);
  }

  // It's a query with compoud index from user_id, token, revoked
  const q = r.table('tokens').getAll([user_id, token, false], { index: 'check_token' });

  return dbRunQuery(q);
});
const dbTokensRevoke = funcWrap([
  object.as({
    user_id: string.require(),
    token: string.require(),
  }).require(),
], (err, { user_id, token }) => {
  if (err) {
    throw new SwipesError(`dbCheckToken: ${err}`);
  }

  // It's a query with compoud index from user_id, token, revoked
  const q =
    r.table('tokens')
      .getAll([user_id, token, false], { index: 'check_token' })
      .update({ revoked: true });

  return dbRunQuery(q);
});
const dbTokensInsertSingle = funcWrap([
  object.as({
    token: string.require(),
    tokenInfo: object.as({
      user_id: string.require(),
      info: object.as({
        platform: string.require(),
        ip: string.require(),
      }).require(),
    }).require(),
  }).require(),
], (err, { token, tokenInfo }) => {
  if (err) {
    throw new SwipesError(`dbTokensInsertSingle: ${err}`);
  }

  const q = r.table('tokens').insert({
    token,
    timestamp: r.now(),
    ...tokenInfo,
  });

  return dbRunQuery(q);
});
const dbTokensGetByUserId = funcWrap([
  object.as({
    user_id: string.require(),
  }).require(),
], (err, { user_id }) => {
  if (err) {
    throw new SwipesError(`dbTokensGetByUserId: ${err}`);
  }

  const q =
    r.table('tokens')
      .getAll(user_id, { index: 'user_id' })
      .filter({ revoked: false })
      .without('token');

  return dbRunQuery(q);
});

export {
  dbTokensInsertSingle,
  dbCheckToken,
  dbTokensRevoke,
  dbTokensGetByUserId,
};
