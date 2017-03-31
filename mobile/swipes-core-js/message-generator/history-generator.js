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
      case 'goal_completed':
        return `${from} completed this goal`;
      case 'goal_archived':
        return `${from} archived this goal`;
      case 'step_completed': {

      }
      case 'goal_notify': {
        return `${from} notified you about this goal`;
      }
      default:
        return h.get('type');
    }
  }
  getSubtitle(h) {
    switch (h.get('type')) {
      case 'step_completed': {

      }
      default:
        return undefined;
    }
  }
  getMessage(h) {

  }
  getFlags(h) {

  }
  getIcon(h) {

  }
}
