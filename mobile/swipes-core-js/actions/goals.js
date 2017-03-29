import * as a from './';
import { valAction } from '../classes/utils';
import GoalsUtil from '../classes/goals-util';

import {
  string,
  any,
  object,
} from 'valjs';

export const create = valAction('goals.create', [
  string.min(1).max(155).require(),
  object,
], (title, noteContent) => (d, getState) => d(a.api.request('goals.create', {
  goal: {
    title,
  },
  note_content: noteContent,
  organization_id: getState().getIn(['me', 'organizations', 0, 'id']),
})),
);

export const loadWay = valAction('goals.loadWay', [
  string.require(),
  any.of(string, object).require(),
], (goalId, wayOrId) => (d) => {
  let way = wayOrId;
  let wayId;
  if (typeof wayOrId === 'string') {
    way = undefined;
    wayId = wayOrId;
  }
  return d(a.api.request('goals.loadWay', {
    goal_id: goalId,
    way_id: wayId,
    way,
  }));
});

export const rename = (goalId, title) => a.api.request('goals.rename', {
  goal_id: goalId,
  title,
});

export const start = (gId) => (d, getState) => {
  const goal = getState().getIn(['goals', gId]);
  const helper = new GoalsUtil(goal);
  const step = helper.getStepByIndex(0);
  return d(a.api.request('goals.start', {
    goal_id: gId,
    next_step_id: step.get('id'),
  }));
};


export const notify = (gId, handoff) => (d, getState) => {
  let assignees = handoff.get('assignees');
  assignees = assignees || assignees.toJS();

  const goal = getState().getIn(['goals', gId]);
  const helper = new GoalsUtil(goal);
  const currentStepId = helper.getCurrentStepId();

  return d(a.api.request('goals.notify', {
    goal_id: gId,
    feedback: (handoff.get('target') === '_feedback'),

    flags: handoff.get('flags'),
    message: handoff.get('message'),
    current_step_id: currentStepId,
    assignees,
  }));
};

export const completeStep = (gId, nextStepId) => (d, getState) => {
  const goal = getState().getIn(['goals', gId]);
  const helper = new GoalsUtil(goal);
  const currentStepId = helper.getCurrentStepId();

  return d(a.api.request('goals.completeStep', {
    goal_id: gId,
    next_step_id: nextStepId,
    current_step_id: currentStepId,
  }));
};

export const archive = goalId => d => d(a.api.request('goals.archive', { goal_id: goalId }));
