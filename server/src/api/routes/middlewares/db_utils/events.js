import r from 'rethinkdb';
import {
  object,
  funcWrap,
} from 'valjs';
import db from '../../../../db';
import {
  SwipesError,
} from '../../../../middlewares/swipes-error';

const commonMultipleEvents = funcWrap([
  object.as({
    objToInsert: object.require(),
  }).require(),
], (err, { objToInsert }) => {
  if (err) {
    throw new SwipesError(`commonMultipleEvents: ${err}`);
  }

  const q = r.table('events_multiple').insert(objToInsert);

  return db.rethinkQuery(q);
});

export {
  commonMultipleEvents,
};
