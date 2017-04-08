import r from 'rethinkdb';
import {
  funcWrap,
} from 'valjs';
import db from '../../../../db';
import {
  SwipesError,
} from '../../../../middlewares/swipes-error';

const dbOnboardingGetAll = funcWrap([
], (err) => {
  if (err) {
    throw new SwipesError(`dbOnboardingGetAll: ${err}`);
  }

  const q = r.table('onboarding');

  return db.rethinkQuery(q);
});

export {
  dbOnboardingGetAll,
};
