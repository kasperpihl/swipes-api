import r from 'rethinkdb';
import {
  string,
  object,
  array,
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
    milestone_id: string.require(),
    properties: object.require(),
  }).require(),
], (err, { milestone_id, properties }) => {
  if (err) {
    throw new SwipesError(`dbMilestonesUpdateSingle: ${err}`);
  }

  const q = r.table('milestones').get(milestone_id).update(properties);

  return db.rethinkQuery(q);
});
const dbMilestonesAddGoal = funcWrap([
  object.as({
    user_id: string.require(),
    goal_id: string.require(),
    milestone_id: string.require(),
  }).require(),
], (err, { user_id, goal_id, milestone_id }) => {
  if (err) {
    throw new SwipesError(`dbMilestonesAddGoal: ${err}`);
  }

  const q =
    r.table('milestones')
      .get(milestone_id)
      .update({
        goal_order: r.row('goal_order').default([]).setUnion([goal_id]),
        updated_at: r.now(),
        updated_by: user_id,
      }, {
        returnChanges: true,
      });

  return db.rethinkQuery(q);
});
const dbMilestonesRemoveGoal = funcWrap([
  object.as({
    user_id: string.require(),
    goal_ids: array.require(),
    milestone_id: string.require(),
  }).require(),
], (err, { user_id, goal_ids, milestone_id }) => {
  if (err) {
    throw new SwipesError(`dbMilestonesRemoveGoal: ${err}`);
  }

  const q =
    r.table('milestones')
      .get(milestone_id)
      .update({
        goal_order: r.row('goal_order').default([]).difference(goal_ids),
        updated_at: r.now(),
        updated_by: user_id,
      }, {
        returnChanges: true,
      });

  return db.rethinkQuery(q);
});
const dbMilestonesMigrateIncompleteGoals = funcWrap([
  object.as({
    milestone_id: string.require(),
    migrate_to_milestone_id: string,
  }).require(),
], (err, { milestone_id, migrate_to_milestone_id }) => {
  if (err) {
    throw new SwipesError(`dbMilestonesMigrateIncompleteGoals: ${err}`);
  }

  const q =
    r.db('swipes')
      .table('milestones')
      .get(milestone_id)('goal_order').do((goal_ids) => {
        return r.db('swipes')
          .table('goals')
          .getAll(r.args(goal_ids))
          .filter({
            archived: false,
            status: { completed: false },
          }, {
            default: true,
          });
      })
      .update({
        milestone_id: migrate_to_milestone_id,
      }, {
        returnChanges: 'always',
      }).do((results) => {
        // In the case that all of the goal in a milestone are completed
        // there will be no changes object
        return results('changes').default({})('new_val').default([]).map((goal) => {
          return goal('id');
        });
      });

  return db.rethinkQuery(q);
});

export {
  dbMilestonesInsertSingle,
  dbMilestonesUpdateSingle,
  dbMilestonesAddGoal,
  dbMilestonesRemoveGoal,
  dbMilestonesMigrateIncompleteGoals,
};
