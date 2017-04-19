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
    goal_id: string.require(),
    milestone_id: string.require(),
  }).require(),
], (err, { user_id, goal_id, milestone_id }) => {
  if (err) {
    throw new SwipesError(`dbMilestonesRemoveGoal: ${err}`);
  }

  const q =
    r.table('milestones')
      .get(milestone_id)
      .update({
        goal_order: r.row('goal_order').default([]).difference([goal_id]),
        updated_at: r.now(),
        updated_by: user_id,
      }, {
        returnChanges: true,
      });

  return db.rethinkQuery(q);
});

export {
  dbMilestonesInsertSingle,
  dbMilestonesUpdateSingle,
  dbMilestonesAddGoal,
  dbMilestonesRemoveGoal,
};
