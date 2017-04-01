export default class NotificationsGenerator {
  constructor(store, parent) {
    this.store = store;
    this.parent = parent;
  }
  getTitle(n, h) {
    return this.parent.history.getTitle(n.getIn(['target', 'id']), h || n);
  }
  getSubtitle(n, h) {
    if (!h) {
      return n.getIn(['meta', 'title']);
    }
  }
  getIcon(n) {
    return this.parent.history.getIcon(n);
  }
}
