import {
  string,
  any,
  object,
} from 'valjs';

import * as a from './';
import { valAction } from '../classes/utils';
import GoalsUtil from '../classes/goals-util';


export const create = valAction('goals.create', [
  string.min(1).max(155).require(),
  object,
  string,
], (title, noteContent, milestoneId) => (d, getState) => {
  d(a.onboarding.complete('create-goal'));
  return d(a.api.request('goals.create', {
    goal: {
      title,
    },
    milestone_id: milestoneId,
    note_content: noteContent,
    organization_id: getState().getIn(['me', 'organizations', 0, 'id']),
  }));
});


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

export const notify = (gId, notification) => d => d(a.api.request('goals.notify', {
  goal_id: gId,
  ...notification.toJS(),
}));

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
