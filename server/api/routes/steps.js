import express from 'express';
import {
  string,
  object,
  array,
} from 'valjs';
import {
  stepsAdd,
  stepsRename,
  stepsDelete,
  stepsReorder,
  stepsAssign,
} from './middlewares/steps';
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
  valResponseAndSend({
    goal_id: string.require(),
    step: object.require(),
    step_order: array.require(),
  }));
// Event: step_added

authed.all('/steps.rename',
  valBody({
    goal_id: string.require(),
    step_id: string.require(),
    title: string.require().min(1),
  }),
  stepsRename,
  valResponseAndSend({
    goal_id: string.require(),
    step_id: string.require(),
    title: string.require(),
  }));
// Event step_renamed

authed.all('/steps.delete',
  valBody({
    goal_id: string.require(),
    step_id: string.require(),
  }),
  stepsDelete,
  valResponseAndSend({
    goal_id: string.require(),
    step_id: string.require(),
  }));
// Event: step_deleted

authed.all('/steps.reorder',
  valBody({
    goal_id: string.require(),
    step_order: array.of(string).require(),
  }),
  stepsReorder,
  valResponseAndSend({
    goal_id: string.require(),
    step_order: array.require(),
  }));
// Event: step_reordered

authed.all('/steps.assign',
  valBody({
    goal_id: string.require(),
    step_id: string.require(),
    assignees: array.of(string).require(),
  }),
  stepsAssign,
  valResponseAndSend({
    goal_id: string.require(),
    step_id: string.require(),
    assignees: array.require(),
  }));
// Event: step_assigned

export {
  authed,
  notAuthed,
};
