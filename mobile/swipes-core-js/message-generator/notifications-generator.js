import { Map } from 'immutable';
import { timeAgo } from '../classes/time-utils';

export default class NotificationsGenerator {
  constructor(store, parent) {
    this.store = store;
    this.parent = parent;
  }
  getNotificationWrapper(notification) {
    const goals = this.store.getState().get('goals');

    const id = notification.getIn(['target', 'id']);
    const index = notification.getIn(['target', 'history_index']);
    const history = goals.getIn([id, 'history', index]);
    console.log(notification.get('seen_at'));
    let m = Map({
      timeago: timeAgo(notification.get('updated_at'), true),
      title: this.getTitle(notification, history),
      subtitle: this.getSubtitle(notification, history),
      request: !!notification.get('request'),
      icon: this.getIcon(notification),
      seen_at: notification.get('seen_at'),
      userId: notification.get('done_by'),
      reply: true,
    });

    if (history) {
      m = m.set('message', history.get('message'));
      m = m.set('attachments', this.parent.history.getAttachments(id, history));
    } else {
      m = m.set('noClickTitle', !!notification.get('seen_at'));
    }
    return m;
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
