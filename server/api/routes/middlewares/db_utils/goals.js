import r from 'rethinkdb';
import {
  string,
  object,
  array,
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

  properties.updated_at = r.now();

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
const dbGoalsCompleteStep = funcWrap([
  object.as({
    goal_id: string.require(),
    step_id: string.require(),
    user_id: string.require(),
    type: string.require(),
  }),
], (err, { goal_id, step_id, user_id, type }) => {
  if (err) {
    throw new SwipesError(`dbGoalsCompleteStep: ${err}`);
  }

  const q =
    r.table('goals')
      .get(goal_id)
      .update((goal) => {
        return {
          steps: r.branch(
            goal('steps').hasFields(step_id),
            goal('steps').merge({
              [step_id]: goal('steps')(step_id).merge({
                updated_at: r.now(),
                updated_by: user_id,
                completed_at: r.branch(
                  goal('steps')(step_id)('completed_at').ne(null),
                  goal('steps')(step_id)('completed_at'),
                  r.now(),
                ),
              }),
            }),
            r.error('Invalid step_id'),
          ),
          history: goal('history').append({
            type,
            step_id,
            done_by: user_id,
            done_at: r.now(),
            assignees: goal('steps')(step_id)('assignees') || [],
          }),
          completed_at: r.branch(
            goal('step_order').map((stepId) => {
              return goal('steps')(stepId);
            }).filter((step) => {
              return step('id').ne(step_id).and(step('completed_at').ne(null));
            })
            .count()
            .eq(goal('step_order').filter(stepId => stepId.ne(step_id)).count()),
            r.now(),
            null,
          ),
          updated_at: r.now(),
        };
      }, {
        returnChanges: true,
      });

  return db.rethinkQuery(q);
});

const dbGoalsIncompleteStep = funcWrap([
  object.as({
    goal_id: string.require(),
    step_id: string.require(),
    user_id: string.require(),
    type: string.require(),
  }),
], (err, { goal_id, step_id, user_id, type }) => {
  if (err) {
    throw new SwipesError(`dbGoalsIncompleteStep: ${err}`);
  }

  const q =
    r.table('goals')
      .get(goal_id)
      .update((goal) => {
        return {
          steps: r.branch(
            goal('steps').hasFields(step_id),
            goal('steps').merge({
              [step_id]: goal('steps')(step_id).merge({
                updated_at: r.now(),
                updated_by: user_id,
                completed_at: null,
              }),
            }),
            r.error('Invalid step_id'),
          ),
          history: goal('history').append({
            type,
            step_id,
            done_by: user_id,
            done_at: r.now(),
            assignees: goal('steps')(step_id)('assignees') || [],
          }),
          completed_at: null,
          updated_at: r.now(),
        };
      }, {
        returnChanges: true,
      });

  return db.rethinkQuery(q);
});
const dbGoalsAppendWayToGoal = funcWrap([
  object.as({
    goal_id: string.require(),
    steps: object.require(),
    step_order: array.require(),
    attachments: object.require(),
    attachment_order: array.require(),
  }),
], (err, { goal_id, steps, step_order, attachments, attachment_order }) => {
  if (err) {
    throw new SwipesError(`dbGoalsAppendWayToGoal: ${err}`);
  }

  const q =
    r.table('goals')
      .get(goal_id)
      .update({
        steps: r.row('steps').merge(steps),
        step_order: r.row('step_order').setUnion(step_order),
        attachments: r.row('attachments').merge(attachments),
        attachment_order: r.row('attachment_order').setUnion(attachment_order),
        updated_at: r.now(),
        completed_at: null,
      }, {
        returnChanges: true,
      });

  return db.rethinkQuery(q);
});
const dbGoalsAssign = funcWrap([
  object.as({
    user_id: string.require(),
    goal_id: string.require(),
    assignees: array.of(string).require(),
  }).require(),
], (err, { user_id, goal_id, assignees }) => {
  if (err) {
    throw new SwipesError(`dbGoalsAssign: ${err}`);
  }

  const q =
    r.db('swipes')
      .table('goals')
      .get(goal_id)
      .update((goal) => {
        return {
          assignees: r.expr([]).setUnion(assignees),
          updated_at: r.now(),
          steps: goal('step_order').map((stepId) => {
            return r.expr([
              stepId,
              goal('steps')(stepId).merge({
                assignees: goal('steps')(stepId)('assignees').default([]).setIntersection(assignees),
                updated_at: r.now(),
              }),
            ]);
          }).coerceTo('object'),
        };
      }, {
        returnChanges: true,
      });

  return db.rethinkQuery(q);
});

export {
  dbGoalsInsertSingle,
  dbGoalsUpdateSingle,
  dbGoalsGetSingle,
  dbGoalsCompleteGoal,
  dbGoalsIncompleteGoal,
  dbGoalsCompleteStep,
  dbGoalsIncompleteStep,
  dbGoalsAppendWayToGoal,
  dbGoalsAssign,
};
