import * as a from 'actions';
import { valAction } from 'classes/utils';
import { convertToRaw, EditorState } from 'draft-js';

import {
  string,
  any,
  object,
} from 'valjs';

export const create = valAction('goals.create', [
  string.min(1).max(155).require(),
], title => (d, getState) => d(a.api.request('goals.create', {
  goal: {
    title,
  },
  note_content: convertToRaw(EditorState.createEmpty().getCurrentContent()),
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

export const start = (gId, handoff) => (d, getState) => {
  let assignees = handoff.get('assignees');
  assignees = assignees || assignees.toJS();

  const nextStepId = getState().getIn(['goals', gId, 'step_order', 0]);
  return d(a.api.request('goals.start', {
    goal_id: gId,

    flags: handoff.get('flags'),
    message: handoff.get('message'),
    current_step_id: null,
    next_step_id: nextStepId,
    assignees,
  }));
};


export const notify = (gId, handoff) => (d, getState) => {
  let assignees = handoff.get('assignees');
  assignees = assignees || assignees.toJS();

  const currentStepId = getState().getIn(['goals', gId, 'status', 'current_step_id']);
  return d(a.api.request('goals.notify', {
    goal_id: gId,
    feedback: (handoff.get('target') === '_feedback'),

    flags: handoff.get('flags'),
    message: handoff.get('message'),
    current_step_id: currentStepId,
    assignees,
  }));
};

export const completeStep = (gId, handoff) => (d, getState) => {
  const currentStepId = getState().getIn(['goals', gId, 'status', 'current_step_id']);
  const target = handoff.get('target') === '_complete' ? null : handoff.get('target');

  let assignees = handoff.get('assignees');
  assignees = assignees && assignees.toJS();
  return d(a.api.request('goals.completeStep', {
    goal_id: gId,
    flags: handoff.get('flags'),
    next_step_id: target,
    current_step_id: currentStepId,
    message: handoff.get('message'),
    assignees,
  }));
};

export const archive = goalId => d => d(a.api.request('goals.archive', { goal_id: goalId }));
