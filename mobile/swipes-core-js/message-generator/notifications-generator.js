import { Map } from 'immutable';
import { timeAgo } from '../classes/time-utils';

export default class NotificationsGenerator {
  constructor(store, parent) {
    this.store = store;
    this.parent = parent;
  }
  getNotificationWrapper(notification, options) {

    let def = {
      seenBy: true,
      reply: true,
    };
    def = Object.assign(def, options);

    const goals = this.store.getState().get('goals');

    const id = notification.getIn(['target', 'id']);
    const index = notification.getIn(['target', 'history_index']);
    const history = goals.getIn([id, 'history', index]);
    let m = Map({
      timeago: timeAgo(notification.get('created_at'), true),
      title: this.getTitle(notification, history),
      subtitle: this.getSubtitle(notification, history),
      request: !!notification.get('request'),
      icon: this.getIcon(notification),
      unseen: notification.get('notification') && !notification.get('seen_at'),
      userId: notification.get('done_by'),
    });

    if (history) {
      if(def.reply) {
        m = m.set('reply', this.parent.history.getReplyButtonForHistory(id, history));
      }
      if(def.seenBy) {
        m = m.set('seenBy', this.parent.history.getSeenByForHistory(history));
      }
      m = m.set('message', history.get('message'));
      m = m.set('attachments', this.parent.history.getAttachments(id, history));
    } else {
      m = m.set('noClickTitle', !!notification.get('seen_at'));
    }
    return m;
  }
  getTitle(n, h) {
    if (!h) {
      const goals = this.store.getState().get('goals');
      const id = n.getIn(['target', 'id']);
      const index = n.getIn(['target', 'history_index']);
      h = goals.getIn([id, 'history', index]);
    }
    return this.parent.history.getTitle(n.getIn(['target', 'id']), h || n);
  }
  getSubtitle(n, h) {
    let extra = '';
    if (!h) {
      extra = ' (archived)';
    }
    return `on ${n.getIn(['meta', 'title'])}${extra}`;
  }
  getMessage(n) {
    const goals = this.store.getState().get('goals');
    const id = n.getIn(['target', 'id']);
    const index = n.getIn(['target', 'history_index']);
    const h = goals.getIn([id, 'history', index]);
    if (h) {
      return h.get('message');
    }
    return undefined;
  }
  getIcon(n) {
    return this.parent.history.getIcon(n);
  }
}
