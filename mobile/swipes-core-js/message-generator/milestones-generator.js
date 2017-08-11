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
      return 'No milestone';
    }
    const milestone = this.getMilestone(milestoneId);
    if (milestone) {
      return milestone.get('title');
    }
    return 'Any milestone';
  }
  getRelatedFilter(milestoneId) {
    const milestone = this.getMilestone(milestoneId);
    if(!milestone) {
      return [];
    }
    return milestone.get('goal_order').toJS()

  }
  getSubtitle(milestoneId) {
    const milestone = this.getMilestone(milestoneId);
    const helper = new MilestonesUtil(milestone);

    const type = milestone.get('closed_at') ? 'milestone_closed' : 'milestone_opened';
    let event = helper.getLastActivityByType(type);
    if (!event) {
      event = helper.getLastActivityByType('milestone_created');
    }
    const ts = timeAgo(event.get('done_at'));
    const name = this.parent.users.getName(event.get('done_by'));
    if (milestone.get('closed_at')) {
      return `Closed by ${name} ${ts}`;
    } else if (event.get('type') === 'milestone_opened') {
      return `Re-opened by ${name} ${ts}`;
    }
    return `Created by ${name} ${ts}`;
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
