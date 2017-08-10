import moment from 'moment';
import GoalsUtil from '../classes/goals-util';
import { timeAgo } from '../classes/time-utils';

export default class Goals {
  constructor(store, parent) {
    this.store = store;
    this.parent = parent;
  }
  getGoal(goal) {
    if (typeof goal === 'string') {
      return this.store.getState().getIn(['goals', goal]);
    }
    return goal;
  }
  getType(goalType) {
    const goalTypes = {
      current: 'Current goals',
      completed: 'Completed goals',
      starred: 'Starred goals',
    };
    return goalTypes[goalType] || 'All goals';
  }
  getRelatedFilter(goalId) {
    const goal = this.getGoal(goalId);
    if(!goal) {
      return [];
    }
    const helper = new GoalsUtil(goal);
    return helper.getOrderedAttachments().toList().filter(
      a => a.getIn(['link', 'service', 'name']) === 'swipes' && a.getIn(['link', 'service', 'type']) === 'note'
    ).map(a => a.getIn(['link', 'service', 'id'])).toJS();

  }
  getSubtitle(goal) {
    const helper = new GoalsUtil(goal);
    let event = helper.getLastActivityByType('goal_completed');
    if(!event) {
      event = helper.getLastActivityByType('goal_created');
    }
    if(!event) return 'Created';
    const ts = timeAgo(event.get('done_at'));
    const name = this.parent.users.getName(event.get('done_by'));
    const start = event.get('type') === 'goal_completed' ? 'Completed' : 'Started';
    let milestonePrefix = '';
    if(goal.get('milestone_id')){
      const msName = this.parent.milestones.getName(goal.get('milestone_id'));
      milestonePrefix = `${msName} // `;
    }
    return `${milestonePrefix}${start} by ${name} ${ts}`;

  }
  getListSubtitle(goal) {
    const helper = new GoalsUtil(goal);
    if (helper.getIsCompleted()) {
      const completedEvent = helper.getLastActivityByType('goal_completed');
      if(completedEvent){
        const ts = timeAgo(completedEvent.get('done_at'));
        const name = msgGen.users.getName(completedEvent.get('done_by'));
        return `Completed by ${name} ${ts}`;
      }
      return 'All done.';
    }
    if (!helper.getNumberOfSteps()) {
      return 'No steps added.';
    }

    return `${helper.getNumberOfCompletedSteps()} / ${helper.getNumberOfSteps()} steps completed.`;
  }

  getFilterLabel(number, filter) {
    const goalTypes = {
      current: 'current ',
      completed: 'completed ',
      starred: 'starred ',
    };

    const typeLabel = goalTypes[filter.get('goalType')] || '';
    let label = `${number} ${typeLabel}goal`;
    if (number !== 1) {
      label += 's';
    }
    if (filter.get('userId') && filter.get('userId') !== 'any') {
      label += ` assigned to ${this.parent.users.getName(filter.get('userId'))}`;
    }
    if (filter.get('milestoneId') && filter.get('milestoneId') !== 'any') {
      label += ` with ${this.parent.milestones.getName(filter.get('milestoneId'))}`;
    }
    if (filter.get('matching') && filter.get('matching').length) {
      label += ` matching "${filter.get('matching')}"`;
    }
    return label;
  }

}
