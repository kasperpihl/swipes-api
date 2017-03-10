import express from 'express';
import {
  string,
  object,
  array,
  bool,
} from 'valjs';
import {
  valBody,
  valResponseAndSend,
} from '../utils';


const authed = express.Router();
const notAuthed = express.Router();

authed.all('/steps.add',
  valBody({
    goal_id: string.require(),
    step: object.require(),
  }),
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

  valResponseAndSend({
    goal_id: string.require(),
    step_id: string.require(),
  }));
// Event: step_deleted

authed.all('/steps.reorder',
  valBody({
    goal_id: string.require(),
    step_order: array.require(),
  }),

  valResponseAndSend({
    goal_id: string.require(),
    step_order: array.require(),
  }));
// Event: step_reordered

authed.all('/steps.assign',
  valBody({
    goal_id: string.require(),
    step_id: string.require(),
    assignees: array.require(),
  }),

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
