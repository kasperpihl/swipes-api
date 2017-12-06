import express from 'express';
import {
  string,
  object,
  array,
  date,
  any,
} from 'valjs';
import {
  stepsAdd,
  stepsRename,
  stepsDelete,
  stepsAssign,
  stepsAddQueueMessage,
  stepsRenameQueueMessage,
  stepsDeleteQueueMessage,
} from './middlewares/steps';
import {
  goalsAssignQueueMessage,
  goalsMilestonesMiddlewares,
  goalsMilestonesMiddlewaresRunComposer,
} from './middlewares/goals';
import {
  notificationsPushToQueue,
} from './middlewares/notifications';
import {
  valBody,
  valResponseAndSend,
} from '../utils';

const authed = express.Router();
const notAuthed = express.Router();

authed.all(
  '/steps.add',
  valBody({
    goal_id: string.require(),
    step: object.as({
      title: string.min(1).require(),
      assignees: array.require(),
    }).require(),
  }),
  stepsAdd,
  stepsAddQueueMessage,
  notificationsPushToQueue,
  goalsAssignQueueMessage,
  notificationsPushToQueue,
  goalsMilestonesMiddlewares,
  goalsMilestonesMiddlewaresRunComposer,
  valResponseAndSend({
    goal_id: string.require(),
    goal_assignees: array.require(),
    step: object.as({
      id: string.require(),
      created_by: string.require(),
      created_at: date.require(),
      updated_at: date.require(),
      updated_by: string.require(),
      title: string.min(1).require(),
      assignees: array.require(),
    }).require(),
    step_order: array.require(),
    completed_at: any,
  }),
);

authed.all(
  '/steps.rename',
  valBody({
    goal_id: string.require(),
    step_id: string.require(),
    title: string.min(1).require(),
  }),
  stepsRename,
  stepsRenameQueueMessage,
  notificationsPushToQueue,
  valResponseAndSend({
    goal_id: string.require(),
    step_id: string.require(),
    title: string.min(1).require(),
  }),
);

authed.all(
  '/steps.delete',
  valBody({
    goal_id: string.require(),
    step_id: string.require(),
  }),
  stepsDelete,
  stepsDeleteQueueMessage,
  notificationsPushToQueue,
  goalsMilestonesMiddlewares,
  goalsMilestonesMiddlewaresRunComposer,
  valResponseAndSend({
    goal_id: string.require(),
    step_id: string.require(),
    completed_at: any,
  }),
);

authed.all(
  '/steps.assign',
  valBody({
    goal_id: string.require(),
    step_id: string.require(),
    assignees: array.of(string).require(),
  }),
  stepsAssign,
  goalsAssignQueueMessage,
  notificationsPushToQueue,
  valResponseAndSend({
    goal_id: string.require(),
    step_id: string.require(),
    assignees: array.require(),
    goal_assignees: array.require(),
  }),
);

export {
  authed,
  notAuthed,
};
