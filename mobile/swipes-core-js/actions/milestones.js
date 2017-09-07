import {
  string,
} from 'valjs';

import * as a from './';
import { valAction } from '../classes/utils';

export const create = valAction('milestones.create', [
  string.min(1).max(155).require(),
], (title) => (d, getState) => {
  return d(a.api.request('milestones.create', {
    title,
    restricted: false,
    organization_id: getState().getIn(['me', 'organizations', 0, 'id']),
  }));
});

export const addGoal = valAction('milestones.addGoal', [
  string.require(),
  string.require(),
], (milestoneId, goalId) => (d, getState) => {
  const currentMilestoneId = getState().getIn(['goals', goalId, 'milestone_id']);
  return d(a.api.request('milestones.addGoal', {
    goal_id: goalId,
    current_milestone_id: currentMilestoneId,
    milestone_id: milestoneId,
    organization_id: getState().getIn(['me', 'organizations', 0, 'id']),
  }));
});

export const removeGoal = valAction('milestones.removeGoal', [
  string.require(),
  string.require(),
], (milestoneId, goalId) => (d, getState) => {
  return d(a.api.request('milestones.removeGoal', {
    goal_id: goalId,
    milestone_id: milestoneId,
    organization_id: getState().getIn(['me', 'organizations', 0, 'id']),
  }));
});

export const rename = valAction('milestones.rename', [
  string.require(),
  string.require(),
], (milestoneId, title) => (d, getState) => d(a.api.request('milestones.rename', {
  milestone_id: milestoneId,
  title,
  organization_id: getState().getIn(['me', 'organizations', 0, 'id']),
})));

export const deleteMilestone = valAction('milestones.delete', [
  string.require(),
], (milestoneId) => (d, getState) => d(a.api.request('milestones.delete', {
  milestone_id: milestoneId
})));

export const open = valAction('milestones.open', [
  string.require(),
], (milestoneId) => (d, getState) => d(a.api.request('milestones.open', {
  milestone_id: milestoneId,
  organization_id: getState().getIn(['me', 'organizations', 0, 'id']),
})));

export const close = valAction('milestones.close', [
  string.require(),
], (milestoneId) => (d, getState) => d(a.api.request('milestones.close', {
  milestone_id: milestoneId,
  organization_id: getState().getIn(['me', 'organizations', 0, 'id']),
})));
