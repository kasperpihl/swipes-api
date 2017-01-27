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

const dbStepsUpdateSingle = funcWrap([
  object.as({
    goal_id: string.require(),
    stepUpdated: object.require(),
  }).require(),
], (err, { goal_id, stepUpdated }) => {
  if (err) {
    throw new SwipesError(`dbStepsUpdateSingle: ${err}`);
  }

  const q =
    r.db('swipes')
      .table('goals')
      .get(goal_id)
      .update((goal) => {
        return goal.merge({
          steps: goal('steps').map((step) => {
            return r.branch(
              step('id').eq(stepUpdated.id),
              step.merge(stepUpdated),
              step,
            );
          }),
        });
      });

  return db.rethinkQuery(q);
});

export default dbStepsUpdateSingle;
