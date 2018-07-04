import r from 'rethinkdb';
import {
  string,
  object,
  funcWrap,
} from 'valjs';
import dbRunQuery from 'src/utils/db/dbRunQuery';
import SwipesError from 'src/utils/SwipesError';

const dbMeUpdateSettings = funcWrap([
  object.as({
    user_id: string.require(),
    settings: object.require(),
  }).require(),
], (err, { user_id, settings }) => {
  if (err) {
    throw new SwipesError(`dbMeUpdateSettings: ${err}`);
  }

  const q =
    r.table('users')
      .get(user_id)
      .update({
        settings,
        updated_at: r.now(),
      });

  return dbRunQuery(q);
});
const dbMeUpdateProfile = funcWrap([
  object.as({
    user_id: string.require(),
    profile: object.require(),
  }).require(),
], (err, { user_id, profile }) => {
  if (err) {
    throw new SwipesError(`dbMeUpdateProfile: ${err}`);
  }

  const q =
    r.table('users')
      .get(user_id)
      .update({
        profile,
        updated_at: r.now(),
      });

  return dbRunQuery(q);
});

export {
  dbMeUpdateSettings,
  dbMeUpdateProfile,
};
