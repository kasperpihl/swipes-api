import { List } from 'immutable';
import MilestonesUtil from '../classes/milestones-util';
import { timeAgo } from '../classes/time-utils';

export default class Milestones {
  constructor(store, parent) {
    this.store = store;
    this.parent = parent;
  }
  getMilestone(milestone) {
    if (typeof milestone === 'string') {
      const state = this.store.getState();
      return state.getIn(['milestones', milestone]);
    }
    return milestone;
  }
  getName(milestoneId) {
    if (milestoneId === 'none') {
      return 'No plan';
    }
    const milestone = this.getMilestone(milestoneId);
    if (milestone) {
      return milestone.get('title');
    }
    return 'Any plan';
  }

  getRelatedFilter(milestoneId) {
    const milestone = this.getMilestone(milestoneId);
    if(!milestone) {
      return [];
    }
    return this.getGoalIds(milestone).toJS()

  }
  getGoalIds(milestoneId, overrideGoals) {
    const milestone = this.getMilestone(milestoneId);
    return milestone.getIn(['goal_order', 'later']).concat(
                  milestone.getIn(['goal_order', 'now'])).concat(
                  milestone.getIn(['goal_order', 'done']))
  }
  getGoals(milestoneId, overrideGoals) { 
    const state = this.store.getState();
    const goals = overrideGoals || state.get('goals');
    return this.getGoalIds(milestoneId, overrideGoals).map(gId => goals.get(gId));
  }
}
