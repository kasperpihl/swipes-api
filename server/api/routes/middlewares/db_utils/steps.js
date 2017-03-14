import r from 'rethinkdb';
import {
  string,
  array,
  object,
  funcWrap,
} from 'valjs';
import db from '../../../../db';
import {
  SwipesError,
} from '../../../../middlewares/swipes-error';

const dbStepsAdd = funcWrap([
  object.as({
    user_id: string.require(),
    goal_id: string.require(),
    step: object.as({
      id: string.format(/^[A-Za-z0-9]+$/g).min(6).max(6).require(),
      title: string.min(1).require(),
      assignees: array.of(string).require(),
    }).require(),
  }).require(),
], (err, { user_id, goal_id, step }) => {
  if (err) {
    throw new SwipesError(`dbStepAdd: ${err}`);
  }

  const q =
    r.db('swipes')
      .table('goals')
      .get(goal_id)
      .update({
        steps: {
          [step.id]: step,
        },
        step_order: r.row('step_order').append(step.id),
        updated_at: r.now(),
        updated_by: user_id,
      }, {
        returnChanges: true,
      });

  return db.rethinkQuery(q);
});
const dbStepsRename = funcWrap([
  object.as({
    user_id: string.require(),
    goal_id: string.require(),
    step_id: string.require(),
    title: string.require().min(1),
  }).require(),
], (err, { user_id, goal_id, step_id, title }) => {
  if (err) {
    throw new SwipesError(`dbStepsRename: ${err}`);
  }

  const q =
    r.db('swipes')
      .table('goals')
      .get(goal_id)
      .update({
        steps: {
          [step_id]: {
            title,
            updated_at: r.now(),
            updated_by: user_id,
          },
        },
        updated_at: r.now(),
        updated_by: user_id,
      });

  return db.rethinkQuery(q);
});
const dbStepsDelete = funcWrap([
  object.as({
    user_id: string.require(),
    goal_id: string.require(),
    step_id: string.require(),
  }).require(),
], (err, { user_id, goal_id, step_id }) => {
  if (err) {
    throw new SwipesError(`dbStepsDelete: ${err}`);
  }

  const q =
    r.db('swipes')
      .table('goals')
      .get(goal_id)
      .update({
        steps: {
          [step_id]: {
            deleted: true,
            updated_at: r.now(),
            updated_by: user_id,
          },
        },
        step_order: r.row('step_order').difference([step_id]),
        updated_at: r.now(),
        updated_by: user_id,
      });

  return db.rethinkQuery(q);
});
const dbStepsReorder = funcWrap([
  object.as({
    user_id: string.require(),
    goal_id: string.require(),
    step_order: array.of(string).require(),
    current_step_id: string.require(),
  }).require(),
], (err, { user_id, goal_id, step_order, current_step_id }) => {
  if (err) {
    throw new SwipesError(`dbStepsReorder: ${err}`);
  }

  const q =
    r.table('goals')
      .get(goal_id)
      .update({
        step_order: r.row('steps')
          // Find all the steps that are not deleted
          // mark the deleted one with null because rethink does not support returning
          // an empty value
          .do((steps) => {
            return steps.keys().map((key) => {
              return r.branch(
                steps(key)('deleted').default(false).ne(true),
                steps(key),
                null,
              );
            // Filter the null (deleted once)
            }).filter((item) => {
              return item.ne(null);
            });
          })
          // Map the steps to an array with ids
          .map((step) => {
            return step('id');
          })
          // Doing setUinion on the new step_order with the array that we made so far
          // will keep the order of the matching one and if there is some difference
          // it would be pushed at the end of the step_order
          .do((items) => {
            return r.expr(step_order).setUnion(items);
          }),
        status: {
          current_step_id,
        },
        updated_at: r.now(),
        updated_by: user_id,
      }, {
        returnChanges: true,
      });

  return db.rethinkQuery(q);
});
const dbStepsAssign = funcWrap([
  object.as({
    user_id: string.require(),
    goal_id: string.require(),
    step_id: string.require(),
    assignees: array.of(string).require(),
  }).require(),
], (err, { user_id, goal_id, step_id, assignees }) => {
  if (err) {
    throw new SwipesError(`dbStepsAssign: ${err}`);
  }

  const q =
    r.db('swipes')
      .table('goals')
      .get(goal_id)
      .update({
        steps: {
          [step_id]: {
            assignees,
            updated_at: r.now(),
            updated_by: user_id,
          },
        },
        updated_at: r.now(),
        updated_by: user_id,
      });

  return db.rethinkQuery(q);
});

export {
 dbStepsAdd,
 dbStepsRename,
 dbStepsDelete,
 dbStepsReorder,
 dbStepsAssign,
};
