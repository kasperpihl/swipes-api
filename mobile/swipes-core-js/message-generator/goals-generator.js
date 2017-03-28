import moment from 'moment';
import GoalsUtil from '../classes/goals-util';

export default class Goals {
  constructor(store, parent) {
    this.store = store;
    this.parent = parent;
  }
  getType(goalType) {
    const goalTypes = {
      current: 'Current goals',
      upcoming: 'Upcoming goals',
      completed: 'Completed goals',
      unstarted: 'Unstarted goals',
    };
    return goalTypes[goalType] || 'All goals';
  }

  getSubtitle(goal, filter) {
    let status = ' '; // TODO: Include default status msg
    const state = this.store.getState();
    const me = state.get('me');
    const helper = new GoalsUtil(goal, me.get('id'));
    const currentStep = helper.getCurrentStep();
    const lastHandoff = helper.getLastHandoff();
    if (!lastHandoff) {
      if (currentStep) {
        return currentStep.get('title');
      }
      return 'Goal completed';
    }
    const doneBy = this.parent.users.getName(lastHandoff.get('done_by'));

    const lastUpdate = moment(lastHandoff.get('done_at') || helper.getLastUpdate());
    let type = 'all';
    if (filter) {
      type = filter.get('goalType');
    }
    if (!helper.getIsStarted()) {
      status = `Created by ${doneBy} ${lastUpdate.fromNow()}`;
    } else if (helper.getIsCompleted()) {
      status = `Completed by ${doneBy} ${lastUpdate.fromNow()}`;
      // Show last
    } else {
      const stepTitle = currentStep.get('title');
      const assignees = currentStep.get('assignees');

      if (assignees.size) {
        let preferId;
        if (filter.get('user')) {
          preferId = filter.get('user').startsWith('U') ? filter.get('user') : undefined;
        }
        const userString = this.parent.users.getNames(assignees, { preferId });

        let hasHave = 'have';
        if (assignees.size === 1 && assignees.get(0) !== me.get('id')) {
          hasHave = 'has';
        }
        const time = lastUpdate.fromNow().slice(0, -4);
        status = `${userString} ${hasHave} been working on '${stepTitle}' for ${time}`;
      } else {
        status = `No one is working on "${stepTitle}"`;
      }
    }
    /* if (type === 'upcoming') {

    }*/
    if (type === 'current') {
      status = `${doneBy} handed this off `;
      if (filter.get('user') !== 'any') {
        let receiver = this.parent.users.getName(filter.get('user'));
        if (receiver === 'you' && doneBy === 'you') {
          receiver = 'yourself (cool!)';
        } else if (receiver === doneBy) {
          receiver += ' (nice!)';
        }
        if (receiver === 'no one') {
          // receiver += ' (Lets find one)'
        }

        status += `to ${receiver} `;
      }
      status += lastUpdate.fromNow();
    }
    return status.charAt(0).toUpperCase() + status.slice(1);
  }

  getFilterLabel(number, filter) {
    const goalTypes = {
      current: 'current ',
      upcoming: 'upcoming ',
      completed: 'completed ',
      unstarted: 'unstarted ',
    };

    const typeLabel = goalTypes[filter.get('goalType')] || '';
    let label = `${number} ${typeLabel}goal`;
    if (number !== 1) {
      label += 's';
    }
    if (filter.get('user') && filter.get('user') !== 'any') {
      label += ` assigned to ${this.parent.users.getName(filter.get('user'))}`;
    }
    if (filter.get('milestone') && filter.get('milestone') !== 'any') {
      label += ` with ${this.parent.milestones.getName(filter.get('milestone'))}`;
    }
    if (filter.get('matching') && filter.get('matching').length) {
      label += ` matching "${filter.get('matching')}"`;
    }
    return label;
  }
}
