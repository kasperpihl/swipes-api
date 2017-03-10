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

authed.all('/steps.delete',
  valBody({
    goal_id: string.require(),
    step_id: string.require(),
  }),

  valResponseAndSend({
    goal_id: string.require(),
    step_id: string.require(),
  }));

authed.all('/steps.reorder',
  valBody({
    goal_id: string.require(),
    step_order: array.require(),
  }),

  valResponseAndSend({
    goal_id: string.require(),
    step_order: array.require(),
  }));

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

export {
  authed,
  notAuthed,
};
