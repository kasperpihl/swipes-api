import r from 'rethinkdb';
import {
  string,
  object,
  funcWrap,
} from 'valjs';
import db from '../../../../db';
import {
  SwipesError,
} from '../../../../middlewares/swipes-error';

const dbMeUpdateSettings = funcWrap([
  object.as({
    user_id: string.require(),
    settings: object.require(),
  }).require(),
], (err, user_id, settings) => {
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

  return db.rethinkQuery(q);
});

export {
  dbMeUpdateSettings,
};
