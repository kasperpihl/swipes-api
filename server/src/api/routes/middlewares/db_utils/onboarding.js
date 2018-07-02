import r from 'rethinkdb';
import {
  string,
  object,
  funcWrap,
} from 'valjs';
import dbRunQuery from 'src/utils/db/dbRunQuery';
import SwipesError from 'src/utils/SwipesError';

const dbOnboardingGetAll = funcWrap([
  string.format('iso8601').require(),
], (err, timestamp) => {
  if (err) {
    throw new SwipesError(`dbOnboardingGetAll: ${err}`);
  }

  const q = r.table('onboarding').filter((item) => {
    return item('updated_at').during(r.ISO8601(timestamp).sub(3600), r.now().add(3600));
  });

  return dbRunQuery(q);
});
const dbOnboardingAddSingleNotification = funcWrap([
  object.as({
    notification: object.require(),
  }).require(),
], (err, { notification }) => {
  if (err) {
    throw new SwipesError(`dbOnboardingAddSingleNotification: ${err}`);
  }

  const q = r.table('notifications').insert(notification);

  return dbRunQuery(q);
});

export {
  dbOnboardingGetAll,
  dbOnboardingAddSingleNotification,
};
