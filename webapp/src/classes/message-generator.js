import moment from 'moment';
import GoalsUtil from './goals-util';

export default class MessageGenerator {
  constructor(store) {
    this.store = store;
  }
  getGoalType(goalType) {
    const goalTypes = {
      current: 'Current goals',
      upcoming: 'Upcoming goals',
      completed: 'Completed goals',
      unstarted: 'Unstarted goals',
    };
    return goalTypes[goalType] || 'All goals';
  }

  getButtonTitleFromHandoffAndGoal(handoff, goal) {
    const helper = new GoalsUtil(goal);
    let label = 'Complete Step';
    if (handoff.get('target') === '_start') {
      label = 'Start Goal';
    } else if (handoff.get('target') === '_complete') {
      label = 'Complete Goal';
    } else if (handoff.get('target') === '_notify') {
      label = 'Send Notification';
    } else if (handoff.get('target') === '_feedback') {
      label = 'Give Feedback';
    } else {
      const nextStepIndex = helper.getStepIndexForId(handoff.get('target'));
      const numberOfCompleted = helper.getNumberOfCompletedSteps();
      if (nextStepIndex === numberOfCompleted) {
        label = 'Reassign Step';
      }
      if (nextStepIndex < numberOfCompleted) {
        label = 'Make Iteration';
      }
    }
    return label;
  }

  getUserString(userId, options) {
    options = options || {};
    const state = this.store.getState();
    const users = state.get('users');
    const me = state.get('me');

    if (userId === 'none') {
      return 'no one';
    }
    if (userId === 'me') {
      return options.yourself ? 'yourself' : 'you';
    }
    if (users) {
      const user = users.get(userId);
      if (user) {
        if (user.get('id') === me.get('id')) {
          return options.yourself ? 'yourself' : 'you';
        }
        return user.get('first_name').toLowerCase();
      }
    }

    return 'anyone';
  }
  getUserArrayString(userIds, options) {
    options = options || {};
    const state = this.store.getState();
    if (!userIds || !userIds.size) {
      return 'no one';
    }
    const me = state.get('me');
    const preferId = options.preferId || me.get('id');
    const numberOfNames = options.number || 1;
    if (userIds.includes(preferId)) {
      userIds = userIds.filter(uId => uId !== preferId).insert(0, preferId);
    }
    const names = userIds.map(uId => this.getUserString(uId, options));
    let nameString = '';
    let i = 0;
    do {
      const name = names.get(i);
      if (i < numberOfNames && name) {
        let seperator = i > 0 ? ', ' : '';
        if (i === (names.size - 1) && i > 0) {
          seperator = ' & ';
        }
        nameString += (seperator + name);
      }
      i += 1;
    } while (i < numberOfNames && i < names.size);
    if (names.size && i < names.size) {
      const extra = (names.size - i);
      nameString += ` & ${extra} other${extra > 1 ? 's' : ''}`;
    }
    return nameString;
  }
  getMilestoneString(milestoneId) {
    const state = this.store.getState();
    const milestones = state.get('milestones');

    if (milestoneId === 'none') {
      return 'no milestone';
    }
    if (milestones) {
      const milestone = milestones.get(milestoneId);
      if (milestone) {
        return milestone.get('title');
      }
    }

    return 'any milestone';
  }
  getGoalSubtitle(goal, filter) {
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
    const doneBy = this.getUserString(lastHandoff.get('done_by'));

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
        const userString = this.getUserArrayString(assignees, { preferId });

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
        let receiver = this.getUserString(filter.get('user'));
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
      label += ` assigned to ${this.getUserString(filter.get('user'))}`;
    }
    if (filter.get('milestone') && filter.get('milestone') !== 'any') {
      label += ` with ${this.getMilestoneString(filter.get('milestone'))}`;
    }
    if (filter.get('matching') && filter.get('matching').length) {
      label += ` matching "${filter.get('matching')}"`;
    }
    return label;
  }
}
