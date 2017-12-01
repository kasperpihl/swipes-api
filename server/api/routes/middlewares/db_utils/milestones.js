import r from 'rethinkdb';
import {
  string,
  number,
  object,
  array,
  any,
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

  properties.updated_at = r.now();

  const q = r.table('milestones').get(milestone_id).update(properties);

  return db.rethinkQuery(q);
});
const dbMilestonesAddGoal = funcWrap([
  object.as({
    goal_id: string.require(),
    milestone_id: string.require(),
  }).require(),
], (err, { goal_id, milestone_id }) => {
  if (err) {
    throw new SwipesError(`dbMilestonesAddGoal: ${err}`);
  }

  const q =
    r.table('milestones')
      .get(milestone_id)
      .update({
        goal_order: {
          now: r.row('goal_order')('now').default([]).difference(goal_id).insertAt(0, goal_id),
          later: r.row('goal_order')('later').default([]).difference(goal_id),
          done: r.row('goal_order')('done').default([]).difference(goal_id),
        },
        updated_at: r.now(),
      }, {
        returnChanges: true,
      });

  return db.rethinkQuery(q);
});
const dbMilestonesRemoveGoal = funcWrap([
  object.as({
    goal_ids: array.require(),
    milestone_id: string.require(),
  }).require(),
], (err, { goal_ids, milestone_id }) => {
  if (err) {
    throw new SwipesError(`dbMilestonesRemoveGoal: ${err}`);
  }

  const q =
    r.table('milestones')
      .get(milestone_id)
      .update({
        goal_order: {
          now: r.row('goal_order')('now').default([]).difference(goal_ids),
          later: r.row('goal_order')('later').default([]).difference(goal_ids),
          done: r.row('goal_order')('done').default([]).difference(goal_ids),
        },
        updated_at: r.now(),
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
      .get(milestone_id)('goal_order').do((goal_order) => {
        return r.db('swipes')
          .table('goals')
          .getAll(r.args(goal_order('now').add(goal_order('later')).add(goal_order('done'))))
          .filter({
            archived: false,
            completed_at: null,
          }, {
            default: true,
          });
      })
      .update({
        milestone_id: migrate_to_milestone_id,
        updated_at: r.now(),
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
const dbMilestonesGoalsReorder = funcWrap([
  object.as({
    milestone_id: string.require(),
    goal_id: string.require(),
    destination: any.of('now', 'later', 'done').require(),
    position: number.require(),
  }).require(),
], (err, {
  milestone_id,
  goal_id,
  destination,
  position,
}) => {
  if (err) {
    throw new SwipesError(`dbMilestonesGoalsReorder: ${err}`);
  }

  const q =
    r.table('milestones')
      .get(milestone_id)
      .update((milestone) => {
        return milestone.merge({
          goal_order: {
            now: milestone('goal_order')('now').setDifference([goal_id]),
            later: milestone('goal_order')('later').setDifference([goal_id]),
            done: milestone('goal_order')('done').setDifference([goal_id]),
          },
        }).merge((milestone) => {
          return milestone.merge({
            goal_order: {
              [destination]: milestone('goal_order')(destination).insertAt(position, goal_id).default(() => {
                return milestone('goal_order')(destination).insertAt(milestone('goal_order')(destination).count(), goal_id);
              }),
            },
            updated_at: r.now(),
          });
        });
      }, {
        returnChanges: 'always',
      });

  return db.rethinkQuery(q);
});
const dbMilestonesDelete = funcWrap([
  object.as({
    milestone_id: string.require(),
  }).require(),
], (err, { milestone_id }) => {
  if (err) {
    throw new SwipesError(`dbMilestonesDelete: ${err}`);
  }

  const q =
    r.table('milestones')
      .get(milestone_id)
      .update({
        deleted: true,
        updated_at: r.now(),
      }, {
        returnChanges: 'always',
      }).do((result) => {
        return r.table('goals')
          .getAll(r.args(result('changes').nth(0)('new_val')('goal_order')('now'))
            .add(r.args(result('changes').nth(0)('new_val')('goal_order')('later')))
            .add(r.args(result('changes').nth(0)('new_val')('goal_order')('done'))))
          .update({
            archived: true,
            updated_at: r.now(),
          }).do(() => {
            return result('changes').nth(0)('new_val')('goal_order');
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
  dbMilestonesGoalsReorder,
  dbMilestonesDelete,
};
