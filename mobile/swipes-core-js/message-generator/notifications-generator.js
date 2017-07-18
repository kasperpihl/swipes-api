import { Map } from 'immutable';
import { timeAgo } from '../classes/time-utils';

const boldText = (id, string) => ({
  id,
  string,
  className: 'notification-item__styled-button',
});

export default class NotificationsGenerator {
  constructor(store, parent) {
    this.store = store;
    this.parent = parent;
  }
  getUserStringMeta(meta) {
    const { users } = this.parent;
    return boldText('users', users.getNames(meta.get('user_ids'), {
      preferId: meta.getIn(['last_reaction', 'created_by']),
      excludeId: 'me',
      number: 2,
    }));
  }
  getImportantUserIdFromMeta(meta) {
    let userId;
    const type = meta.get('event_type');
    if ([
      'post_reaction_added',
      'post_comment_added',
      'post_comment_reaction_added',
    ].indexOf(type) !== -1) {
      userId = meta.getIn(['user_ids', 0]);
    } else if (['post_created'].indexOf(type) !== -1) {
      userId = meta.get('created_by');
    } else {
      return 'me';
    }
    return userId;
  }
  getStyledTextForNotification(n) {
    const meta = n.get('meta');
    const { users, posts } = this.parent;
    const text = [];
    switch (meta.get('event_type')) {
      case 'step_assigned': {
        const count = meta.get('step_assign_count');
        text.push('You have been assigned to ');
        text.push(boldText('count', `${count} step${count > 1 ? 's' : ''}`));
        text.push(` in: "${meta.get('goal_title')}"`);
        break;
      }
      case 'post_created': {
        text.push(boldText('send', users.getName(meta.get('created_by'))));
        text.push(` ${posts.getPostTypeTitle(meta.get('type'))}`);
        text.push(` ${meta.get('type') === 'question' ? ' of ' : ' to '} `);
        text.push(boldText('users', 'you'));
        text.push(`: "${meta.get('message')}"'`);
        break;
      }
      case 'post_reaction_added': {
        text.push(this.getUserStringMeta(meta));
        text.push(` liked your ${meta.get('type')}: "${meta.get('message')}"`);
        break;
      }
      case 'post_comment_added': {
        text.push(this.getUserStringMeta(meta));
        const byMe = meta.get('created_by') === users.getUser('me');
        const followString = byMe ? '' : ' you follow';
        const preFix = byMe ? 'your ' : posts.getPrefixForType(meta.get('type'));
        text.push(` commented on ${preFix}${meta.get('type')}${followString}: "${meta.get('message')}"`);
        break;
      }
      case 'post_comment_reaction_added': {
        text.push(this.getUserStringMeta(meta));
        text.push(` liked your comment: "${meta.get('message')}"`);
        break;
      }
    }
    return text;
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
      if (def.reply) {
        m = m.set('reply', this.parent.history.getReplyButtonForHistory(id, history));
      }
      if (def.seenBy) {
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
