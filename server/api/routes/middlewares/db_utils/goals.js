import r from 'rethinkdb';
import {
  string,
  object,
  funcWrap,
  number,
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
const dbGoalsCompleteGoal = funcWrap([
  object.as({
    goal_id: string.require(),
    user_id: string.require(),
    historyItem: object.require(),
  }),
], (err, { goal_id, user_id, historyItem }) => {
  if (err) {
    throw new SwipesError(`dbGoalsCompleteGoal: ${err}`);
  }

  const q =
    r.table('goals')
      .get(goal_id)
      .update((goal) => {
        return {
          steps: goal('step_order').map((stepId) => {
            return r.expr([
              stepId,
              goal('steps')(stepId).merge({
                updated_at: r.now(),
                updated_by: user_id,
                completed_at: r.branch(
                  goal('steps')(stepId)('completed_at').ne(null),
                  goal('steps')(stepId)('completed_at'),
                  r.now(),
                ),
              }),
            ]);
          }).coerceTo('object'),
          history: goal('history').append(historyItem),
          completed_at: r.now(),
          updated_at: r.now(),
          updated_by: user_id,
        };
      }, {
        returnChanges: true,
      });

  return db.rethinkQuery(q);
});
const dbGoalsIncompleteGoal = funcWrap([
  object.as({
    goal_id: string.require(),
    user_id: string.require(),
    historyItem: object.require(),
  }),
], (err, { goal_id, user_id, historyItem }) => {
  if (err) {
    throw new SwipesError(`dbGoalsCompleteGoal: ${err}`);
  }

  const q =
    r.table('goals')
      .get(goal_id)
      .update((goal) => {
        return {
          steps: goal('step_order').map((stepId) => {
            return r.expr([
              stepId,
              goal('steps')(stepId).merge({
                updated_at: r.now(),
                updated_by: user_id,
                completed_at: null,
              }),
            ]);
          }).coerceTo('object'),
          history: goal('history').append(historyItem),
          completed_at: null,
          updated_at: r.now(),
          updated_by: user_id,
        };
      }, {
        returnChanges: true,
      });

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

  const q =
    r.table('goals')
      .get(goal_id)
      .update(properties, {
        returnChanges: true,
      });

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
const dbGoalsRepliesHistoryUpdate = funcWrap([
  object.as({
    reply_index: number.require(),
    target: object.as({
      id: string.require(),
      history_index: number.int().gte(0).require(),
    }).require(),
  }).require(),
], (err, { reply_index, target }) => {
  if (err) {
    throw new SwipesError(`dbGoalsRepliesHistoryUpdate: ${err}`);
  }

  let table = '';

  if (target.id.startsWith('G')) {
    table = 'goals';
  }

  const q =
    r.table(table)
      .get(target.id)
      .update({
        history: r.row('history')
          .changeAt(target.history_index,
            r.row('history')
              .nth(target.history_index)
              .merge((item) => {
                return {
                  replies: item('replies').default([]).setUnion([reply_index]),
                };
              }),
          ),
      }, {
        returnChanges: true,
      });

  return db.rethinkQuery(q);
});

export {
  dbGoalsInsertSingle,
  dbGoalsUpdateSingle,
  dbGoalsGetSingle,
  dbGoalsPushToHistorySingle,
  dbGoalsRepliesHistoryUpdate,
  dbGoalsCompleteGoal,
  dbGoalsIncompleteGoal,
};
