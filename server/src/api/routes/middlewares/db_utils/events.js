import r from 'rethinkdb';
import {
  object,
  funcWrap,
} from 'valjs';
import dbRunQuery from 'src/utils/db/dbRunQuery';
import SwipesError from 'src/utils/SwipesError';

const commonMultipleEvents = funcWrap([
  object.as({
    objToInsert: object.require(),
  }).require(),
], (err, { objToInsert }) => {
  if (err) {
    throw new SwipesError(`commonMultipleEvents: ${err}`);
  }

  const q = r.table('events_multiple').insert(objToInsert);

  return dbRunQuery(q);
});

export {
  commonMultipleEvents,
};
