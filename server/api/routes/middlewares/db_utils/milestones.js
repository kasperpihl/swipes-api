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

const dbMilestonesInsertSingle = funcWrap([
  object.as({
    milestone: object.require(),
  }).require(),
], (err, { milestone }) => {
  if (err) {
    throw new SwipesError(`dbMilestonesInsertSingle: ${err}`);
  }

  const q = r.table('milestones').insert(milestone);

  return db.rethinkQuery(q);
});
const dbMilestonesUpdateSingle = funcWrap([
  object.as({
    id: string.require(),
    properties: object.require(),
  }).require(),
], (err, { id, properties }) => {
  if (err) {
    throw new SwipesError(`dbMilestonesUpdateSingle: ${err}`);
  }

  const q = r.table('milestones').get(id).update(properties);

  return db.rethinkQuery(q);
});

export {
  dbMilestonesInsertSingle,
  dbMilestonesUpdateSingle,
};
