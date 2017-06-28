import express from 'express';
import {
  string,
  object,
  array,
} from 'valjs';
import {
  milestonesCreate,
  milestonesInsert,
  milestonesClose,
  milestonesOpen,
  milestonesUpdateSingle,
  milestonesCreateQueueMessage,
  milestonesOpenCloseQueueMessage,
  milestonesAddGoal,
  milestonesAddGoalQueueMessage,
  milestonesRemoveGoal,
  milestonesRemoveGoalQueueMessage,
  milestoneMigrateIncompleteGoals,
  milestoneRename,
  milestonesRenameQueueMessage,
  milestonesGoalsReorder,
  milestonesGoalsReorderQueueMessage,
} from './middlewares/milestones';
import {
  goalsAddMilestone,
  goalsRemoveMilestone,
  goalsGetSingle,
} from './middlewares/goals';
import {
  notificationsPushToQueue,
} from './middlewares/notifications';
import {
  notificationCreateGroupId,
} from './middlewares/util_middlewares';
import {
  valBody,
  valResponseAndSend,
  mapLocals,
} from '../utils';

const authed = express.Router();
const notAuthed = express.Router();

authed.all('/milestones.create',
  valBody({
    title: string.require(),
    organization_id: string.require(),
    due_date: string.format('iso8601'),
  }),
  notificationCreateGroupId,
  milestonesCreate,
  milestonesInsert,
  milestonesCreateQueueMessage,
  notificationsPushToQueue,
  valResponseAndSend({
    milestone: object.require(),
  }));

authed.all('/milestones.close',
  valBody({
    milestone_id: string.require(),
    migrate_to_milestone_id: string,
  }),
  notificationCreateGroupId,
  milestoneMigrateIncompleteGoals,
  milestonesRemoveGoal,
  milestonesClose,
  milestonesUpdateSingle,
  milestonesOpenCloseQueueMessage,
  notificationsPushToQueue,
  valResponseAndSend({
    milestone_id: string.require(),
    goal_order: array.require(),
    goal_ids: array,
  }));

authed.all('/milestones.open',
  valBody({
    milestone_id: string.require(),
  }),
  notificationCreateGroupId,
  milestonesOpen,
  milestonesUpdateSingle,
  milestonesOpenCloseQueueMessage,
  notificationsPushToQueue,
  valResponseAndSend({
    milestone_id: string.require(),
  }));

authed.all('/milestones.addGoal',
  valBody({
    goal_id: string.require(),
    milestone_id: string.require(),
    current_milestone_id: string,
  }),
  mapLocals(locals => ({
    goal_ids: [locals.goal_id],
  })),
  goalsGetSingle,
  mapLocals(locals => ({
    old_milestone_id: locals.goal.milestone_id,
  })),
  goalsAddMilestone,
  milestonesRemoveGoal,
  milestonesAddGoal,
  milestonesAddGoalQueueMessage,
  notificationsPushToQueue,
  valResponseAndSend({
    goal_id: string.require(),
    milestone_id: string.require(),
    old_milestone_id: string.require(),
    goal_order: array.require(),
  }),
);

authed.all('/milestones.removeGoal',
  valBody({
    goal_id: string.require(),
    milestone_id: string.require(),
  }),
  mapLocals(locals => ({
    goal_ids: [locals.goal_id],
  })),
  goalsRemoveMilestone,
  milestonesRemoveGoal,
  milestonesRemoveGoalQueueMessage,
  notificationsPushToQueue,
  valResponseAndSend({
    goal_id: string.require(),
    milestone_id: string.require(),
    goal_order: array.require(),
  }),
);

authed.all('/milestones.rename',
  valBody({
    milestone_id: string.require(),
    title: string.require(),
  }),
  milestoneRename,
  milestonesUpdateSingle,
  milestonesRenameQueueMessage,
  notificationsPushToQueue,
  valResponseAndSend({
    milestone_id: string.require(),
    title: string.require(),
  }),
);

authed.all('/milestones.goalsReorder',
  valBody({
    milestone_id: string.require(),
    goal_order: array.of(string).require(),
  }),
  milestonesGoalsReorder,
  milestonesGoalsReorderQueueMessage,
  notificationsPushToQueue,
  valResponseAndSend({
    milestone_id: string.require(),
    goal_order: array.of(string).require(),
  }),
);

export {
  authed,
  notAuthed,
};
