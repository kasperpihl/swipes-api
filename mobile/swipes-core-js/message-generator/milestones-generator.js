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
    return milestone.get('goal_order').toJS()

  }

  getGoals(milestoneId, overrideGoals) {
    const milestone = this.getMilestone(milestoneId);
    const state = this.store.getState();
    const goals = overrideGoals || state.get('goals');
    return milestone.get('goal_order')
                    .reverse()
                    .map(gId => goals.get(gId));
  }
}
