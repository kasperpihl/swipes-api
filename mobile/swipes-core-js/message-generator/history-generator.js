export default class HistoryGenerator {
  constructor(store, parent) {
    this.store = store;
    this.parent = parent;
  }
  getTitle(h) {
    const from = this.parent.users.getName(h.get('done_by'));
    switch (h.get('type')) {
      case 'goal_created':
        return `${from} kicked off this goal`;
      case 'step_completed':
      case 'goal_completed':
        return `${from} completed this goal`;
      case 'goal_archived':
        return `${from} archived this goal`;
      default:
        return h.get('type');
    }
  }
  getSubtitle(h) {

  }
  getMessage(h) {

  }
  getFlags(h) {

  }
  getIcon(h) {

  }
}
