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
  getDesktopNotification(n) {
    const meta = n.get('meta');
    const notif = {
      id: n.get('id'),
      context: n.get('context').toJS(),
    };
    switch (meta.get('event_type')) {
      case 'step_assigned': {
        notif.title = 'You got assigned to a step';
        break;
      }
      case 'post_created': {
        break;
      }
      case 'post_reaction_added': {
        break;
      }
      case 'post_comment_added': {
        break;
      }
      case 'post_comment_reaction_added': {
        break;
      }
    }
    if(!notif.title) {
      return undefined;
    }
    return notif;
  }
}
