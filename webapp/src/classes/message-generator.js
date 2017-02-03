export default class MessageGenerator {
  constructor(store) {
    this.store = store;
  }
  getGoalTypeForValue(goalType) {
    const goalTypes = {
      current: 'Current goals',
      upcoming: 'Upcoming goals',
      completed: 'Completed goals',
    };
    return goalTypes[goalType] || 'All goals';
  }

  getUserStringForValue(userId) {
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

  getMilestoneStringForValue(milestoneId) {
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
      label += ` assigned to ${this.getUserStringForValue(filter.get('user'))}`;
    }
    if (filter.get('milestone') !== 'any') {
      label += ` with ${this.getMilestoneStringForValue(filter.get('milestone'))}`;
    }
    return label;
  }
}
