import r from 'rethinkdb';
import {
  string,
  funcWrap,
} from 'valjs';
import db from '../../../../db';
import {
  SwipesError,
} from '../../../../middlewares/swipes-error';

const dbOnboardingGetAll = funcWrap([
  string.format('iso8601').require(),
], (err, timestamp) => {
  if (err) {
    throw new SwipesError(`dbOnboardingGetAll: ${err}`);
  }

  const q = r.table('onboarding').filter((item) => {
    return item('updated_at').during(r.ISO8601(timestamp).sub(3600), r.now().add(3600));
  });

  return db.rethinkQuery(q);
});

export {
  dbOnboardingGetAll,
};
