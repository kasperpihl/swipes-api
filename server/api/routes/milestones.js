import express from 'express';
import {
  string,
  number,
  object,
  array,
  date,
  any,
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
  milestonesDelete,
  milestonesDeleteQueueMessage,
  milestonesGoalsMiddlewares,
} from './middlewares/milestones';
import {
  goalsAddMilestone,
  goalsRemoveMilestone,
  goalsGetSingle,
} from './middlewares/goals';
import {
  organizationsAddMilestone,
  organizationsRemoveMilestone,
} from './middlewares/organizations';
import {
  notificationsPushToQueue,
} from './middlewares/notifications';
import MiddlewareComposer from './middleware_composer';
import {
  valBody,
  valResponseAndSend,
  mapLocals,
} from '../utils';

const authed = express.Router();
const notAuthed = express.Router();

authed.all(
  '/milestones.create',
  valBody({
    organization_id: string.require(),
    title: string.require(),
    due_date: string.format('iso8601'),
  }),
  milestonesCreate,
  milestonesInsert,
  mapLocals(locals => ({
    milestone_id: locals.milestone.id,
  })),
  organizationsAddMilestone,
  milestonesCreateQueueMessage,
  notificationsPushToQueue,
  valResponseAndSend({
    organization_id: string.require(),
    milestone_order: array.require(),
    milestone: object.require(),
  }),
);

authed.all(
  '/milestones.delete',
  valBody({
    organization_id: string.require(),
    milestone_id: string.require(),
  }),
  milestonesDelete,
  organizationsRemoveMilestone,
  milestonesDeleteQueueMessage,
  notificationsPushToQueue,
  valResponseAndSend({
    organization_id: string.require(),
    milestone_order: array.require(),
    milestone_id: string.require(),
    goal_ids: array.of(string),
  }),
);

authed.all(
  '/milestones.close',
  valBody({
    organization_id: string.require(),
    milestone_id: string.require(),
    migrate_to_milestone_id: string,
  }),
  milestoneMigrateIncompleteGoals,
  milestonesRemoveGoal,
  milestonesClose,
  milestonesUpdateSingle,
  organizationsRemoveMilestone,
  milestonesOpenCloseQueueMessage,
  notificationsPushToQueue,
  valResponseAndSend({
    organization_id: string.require(),
    milestone_order: array.require(),
    milestone_id: string.require(),
    closed_at: date.require(),
    goal_order: object.require(),
    goal_ids: array,
  }),
);

authed.all(
  '/milestones.open',
  valBody({
    organization_id: string.require(),
    milestone_id: string.require(),
  }),
  milestonesOpen,
  milestonesUpdateSingle,
  organizationsAddMilestone,
  milestonesOpenCloseQueueMessage,
  notificationsPushToQueue,
  valResponseAndSend({
    organization_id: string.require(),
    milestone_order: array.require(),
    milestone_id: string.require(),
  }),
);

authed.all(
  '/milestones.addGoal',
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
    old_milestone_id: string,
    goal_order: object.require(),
  }),
);

authed.all(
  '/milestones.removeGoal',
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
    goal_order: object.require(),
  }),
);

authed.all(
  '/milestones.rename',
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

authed.all(
  '/milestones.goalsReorder',
  valBody({
    milestone_id: string.require(),
    goal_id: string.require(),
    destination: any.of('now', 'later', 'done').require(),
    position: number.require(),
  }),
  goalsGetSingle,
  milestonesGoalsReorder,
  milestonesGoalsReorderQueueMessage,
  notificationsPushToQueue,
  milestonesGoalsMiddlewares,
  (originalReq, originalRes, originalNext) => {
    const {
      goalsMiddlewares = [],
    } = originalRes.locals;

    const composer = new MiddlewareComposer(
      originalRes.locals,
      ...goalsMiddlewares,
      (req, res, next) => {
        return originalNext();
      },
      (err, req, res, next) => {
        return originalNext(err);
      },
    );

    return composer.run();
  },
  valResponseAndSend({
    milestone_id: string.require(),
    goal_order: object.require(),
  }),
);

export {
  authed,
  notAuthed,
};
