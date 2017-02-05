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
    };
    return goalTypes[goalType] || 'All goals';
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
        return user.get('name').split(' ')[0].toLowerCase();
      }
    }

    return 'anyone';
  }
  getUserArrayString(userIds, options) {
    options = options || {};
    const state = this.store.getState();
    const me = state.get('me');
    const preferId = options.preferId || me.get('id');

    const names = userIds.map(uId => this.getUserString(uId, options));
    let nameString = names.find((name, i) => userIds.get(i) === preferId);
    if (!nameString) {
      nameString = names.get(0);
    }
    if (names.size > 1) {
      nameString += ` & ${names.size - 1} other${names.size > 2 ? 's' : ''}`;
    }
    if (!nameString) {
      nameString = 'no one';
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
    const helper = new GoalsUtil(goal, me);
    const lastHandoff = helper.getLastHandoff();
    const doneBy = this.getUserString(lastHandoff.get('done_by'));
    const currentStep = helper.getCurrentStep();
    const lastUpdate = moment(lastHandoff.get('done_at') || helper.getLastUpdate());
    let type = 'all';
    if (filter) {
      type = filter.get('goalType');
    }
    if (!currentStep) {
      status = `Completed by ${doneBy} ${lastUpdate.fromNow()}`;
      // Show last
    } else {
      const stepTitle = currentStep.get('title');
      const assignees = currentStep.get('assignees');

      if (assignees.size) {
        const preferId = filter.get('user').startsWith('U') ? filter.get('user') : undefined;
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
    if (type === 'upcoming') {

    }
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
    };

    const typeLabel = goalTypes[filter.get('goalType')] || '';
    let label = `${number} ${typeLabel}goal`;
    if (number !== 1) {
      label += 's';
    }
    if (filter.get('user') !== 'any') {
      label += ` assigned to ${this.getUserString(filter.get('user'))}`;
    }
    if (filter.get('milestone') !== 'any') {
      label += ` with ${this.getMilestoneString(filter.get('milestone'))}`;
    }
    return label;
  }
}
