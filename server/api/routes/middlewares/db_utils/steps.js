"use strict";

import r from 'rethinkdb';
import db from '../../../../db';

const dbStepsUpdateSingle = ({ goal_id, step }) => {
  const q =
    r.db('swipes')
      .table('goals')
      .get(goal_id)
      .update((goal) => {
        return goal.merge({
          steps: goal('steps').map((step) => {
            return r.branch(
              step('id').eq(step.id),
              step.merge(step),
              step
            )
          })
        })
      })

  return db.rethinkQuery(q);
}

export {
  dbStepsUpdateSingle
}
