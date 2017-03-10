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
    step: object.as({
      id: string.require(),
      title: string.min(1).require(),
      assignees: array.require(),
    }).require(),
  }),
  /*
    T_TODO:
    [] add step to steps object (indexed by id)
    [] add id to step_order
  */
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
  /*
    T_TODO:
    [] rename steps[step_id].title
  */
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
  /*
    T_TODO:
    [] add deleted: true to steps[step_id]
    [] remove step_id from step_order
  */
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
  /*
    T_TODO:
    [] update the step_order array with new value
    [] check that all steps with !deleted is part of step_order array
    [] insert any !deleted steps that is not part to the end of the step_order array
  */
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
  /*
    T_TODO:
    [] set assignees object for step[step_id]
  */
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
