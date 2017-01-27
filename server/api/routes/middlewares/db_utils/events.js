import r from 'rethinkdb';
// import Promise from 'bluebird';
import {
  string,
  object,
  funcWrap,
} from 'valjs';
import db from '../../../../db';
import {
  SwipesError,
} from '../../../../middlewares/swipes-error';

const initActivities = funcWrap([
  string.require(),
], (err, user_id) => {
  if (err) {
    throw new SwipesError(`initActivities: ${err}`);
  }

  const q =
    r.table('events')
      .filter((e) => {
        return e('user_id').eq(user_id).and(e('type').eq('activity_added'));
      })
      .orderBy(r.desc('date'))
      .without(['id', 'user_id', 'type'])
      .limit(100);

  return db.rethinkQuery(q);
});
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
  initActivities,
  commonMultipleEvents,
};
