import express from 'express';
import {
  string,
  object,
  array,
  date,
} from 'valjs';
import {
  stepsAdd,
  stepsRename,
  stepsDelete,
  stepsReorder,
  stepsAssign,
  stepsAddQueueMessage,
  stepsRenameQueueMessage,
  stepsDeleteQueueMessage,
  stepsReorderQueueMessage,
  stepsAssignQueueMessage,
} from './middlewares/steps';
import {
  notificationsPushToQueue,
} from './middlewares/notifications';
import {
  valBody,
  valResponseAndSend,
} from '../utils';

const authed = express.Router();
const notAuthed = express.Router();

authed.all('/steps.add',
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
  valResponseAndSend({
    goal_id: string.require(),
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
  }));

authed.all('/steps.rename',
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
  }));

authed.all('/steps.delete',
  valBody({
    goal_id: string.require(),
    step_id: string.require(),
  }),
  stepsDelete,
  stepsDeleteQueueMessage,
  notificationsPushToQueue,
  valResponseAndSend({
    goal_id: string.require(),
    step_id: string.require(),
  }));

authed.all('/steps.reorder',
  valBody({
    goal_id: string.require(),
    step_order: array.of(string).require(),
    current_step_id: string.require(),
  }),
  stepsReorder,
  stepsReorderQueueMessage,
  notificationsPushToQueue,
  valResponseAndSend({
    goal_id: string.require(),
    step_order: array.require(),
    status: object.require(),
  }));

authed.all('/steps.assign',
  valBody({
    goal_id: string.require(),
    step_id: string.require(),
    assignees: array.of(string).require(),
  }),
  stepsAssign,
  stepsAssignQueueMessage,
  notificationsPushToQueue,
  valResponseAndSend({
    goal_id: string.require(),
    step_id: string.require(),
    assignees: array.require(),
  }));

export {
  authed,
  notAuthed,
};
