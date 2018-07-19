import r from 'rethinkdb';
import {
  object,
  funcWrap,
} from 'valjs';
import dbRunQuery from 'src/utils/db/dbRunQuery';
import SwipesError from 'src/utils/SwipesError';

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
  dbOnboardingAddSingleNotification,
};
