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

const dbWaysGetSingle = funcWrap([
  object.as({
    way_id: string.require(),
  }).require(),
], (err, { way_id }) => {
  if (err) {
    throw new SwipesError(`dbWaysGetSingle: ${err}`);
  }

  const q = r.table('ways').get(way_id);

  return db.rethinkQuery(q);
});
const dbWaysInsertSingle = funcWrap([
  object.as({
    way: object.require(),
  }).require(),
], (err, { way }) => {
  if (err) {
    throw new SwipesError(`dbWaysInsertSingle: ${err}`);
  }

  const q = r.table('ways').insert(way);

  return db.rethinkQuery(q);
});
const dbWaysUpdateSingle = funcWrap([
  object.as({
    id: string.require(),
    properties: object.require(),
  }).require(),
], (err, { id, properties }) => {
  if (err) {
    throw new SwipesError(`dbWaysUpdateSingle: ${err}`);
  }

  const q = r.table('ways').get(id).update(properties);

  return db.rethinkQuery(q);
});

export {
  dbWaysGetSingle,
  dbWaysInsertSingle,
  dbWaysUpdateSingle,
};
