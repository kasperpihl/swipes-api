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

  getUserString(userId) {
    const state = this.store.getState();
    const users = state.get('users');
    const me = state.get('me');

    if (userId === 'none') {
      return 'no one';
    }
    if (userId === 'me') {
      return 'you';
    }
    if (users) {
      const user = users.get(userId);
      if (user) {
        if (user.get('id') === me.get('id')) {
          return 'you';
        }
        return user.get('name').split(' ')[0].toLowerCase();
      }
    }

    return 'anyone';
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
    let status = ''; // TODO: Include default status msg
    const state = this.store.getState();
    const me = state.get('me');
    const helper = new GoalsUtil(goal, me);
    const lastHandoff = helper.getLastHandoff();
    const doneBy = this.getUserString(lastHandoff.get('done_by'));
    const lastUpdate = moment(lastHandoff.get('done_at') || helper.getLastUpdate());
    let type = 'all';
    if (filter) {
      type = filter.get('goalType');
    }
    if (type === 'completed') {
      status = `Completed by ${doneBy} ${lastUpdate.fromNow()}`;
      // Show last
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
