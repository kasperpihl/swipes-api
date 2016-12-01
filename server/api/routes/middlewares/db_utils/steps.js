import r from 'rethinkdb';
import db from '../../../../db';

const dbStepsUpdateSingle = ({ goal_id, stepUpdated }) => {
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
};

export default dbStepsUpdateSingle;
