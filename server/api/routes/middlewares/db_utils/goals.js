import r from 'rethinkdb';
import {
  string,
  object,
  funcWrap,
} from 'valjs';
import db from '../../../../db';
import {
  goalFullMoreStrict,
} from '../../../validators';
import {
  SwipesError,
} from '../../../../middlewares/swipes-error';

const dbGoalsInsertSingle = funcWrap([
  object.as({
    goal: goalFullMoreStrict,
  }),
], (err, { goal }) => {
  if (err) {
    throw new SwipesError(`dbGoalsInsertSingle: ${err}`);
  }

  const q = r.table('goals').insert(goal, { returnChanges: true });

  return db.rethinkQuery(q);
});
const dbGoalsUpdateSingle = funcWrap([
  object.as({
    goal_id: string.require(),
    properties: object.require(),
  }),
], (err, { goal_id, properties }) => {
  if (err) {
    throw new SwipesError(`dbGoalsUpdateSingle: ${err}`);
  }

  const q = r.table('goals').get(goal_id).update(properties);

  return db.rethinkQuery(q);
});
const dbGoalsGetSingle = funcWrap([
  object.as({
    goal_id: string.require(),
  }),
], (err, { goal_id }) => {
  if (err) {
    throw new SwipesError(`dbGoalsGetSingle: ${err}`);
  }

  const q = r.table('goals').get(goal_id);

  return db.rethinkQuery(q);
});
const dbGoalsPushToHistorySingle = funcWrap([
  object.as({
    goal_id: string.require(),
    historyItem: object.require(),
  }),
], (err, { goal_id, historyItem }) => {
  if (err) {
    throw new SwipesError(`dbGoalsPushToHistorySingle: ${err}`);
  }

  const q =
    r.table('goals')
      .get(goal_id)
      .update({
        history: r.row('history').append(historyItem),
      }, { returnChanges: true });

  return db.rethinkQuery(q);
});

export {
  dbGoalsInsertSingle,
  dbGoalsUpdateSingle,
  dbGoalsGetSingle,
  dbGoalsPushToHistorySingle,
};
