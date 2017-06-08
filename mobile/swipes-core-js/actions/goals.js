import {
  string,
  any,
  object,
} from 'valjs';

import * as a from './';
import { valAction } from '../classes/utils';

export const create = valAction('goals.create', [
  string.min(1).max(155).require(),
  object,
  string,
], (title, noteContent, milestoneId) => (d, getState) => {
  // d(a.onboarding.complete('create-goal'));
  if(milestoneId){
    d(a.onboarding.complete('add-goal-milestone'));
  }
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
  string.require(),
], (goalId, wayId) => (d) => {
  return d(a.api.request('goals.loadWay', {
    goal_id: goalId,
    way_id: wayId,
  }));
});

export const rename = (goalId, title) => a.api.request('goals.rename', {
  goal_id: goalId,
  title,
});

export const notify = (gId, notification) => a.api.request('goals.notify', {
  goal_id: gId,
  ...notification.toJS(),
});

export const completeStep = (gId, sId) => a.api.request('goals.completeStep', {
  goal_id: gId,
  step_id: sId,
})

export const incompleteStep = (gId, sId) => a.api.request('goals.incompleteStep', {
  goal_id: gId,
  step_id: sId,
})

export const complete = (gId) => a.api.request('goals.complete', {
  goal_id: gId,
})

export const incomplete = (gId) => a.api.request('goals.incomplete', {
  goal_id: gId,
})

export const archive = goalId => a.api.request('goals.archive', { goal_id: goalId });
