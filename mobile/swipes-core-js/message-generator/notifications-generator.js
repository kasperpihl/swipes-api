import { Map } from 'immutable';

const boldText = (id, string, boldStyle) => {
  const obj = {
    id,
    string,
    className: 'notification-item__styled-button',
  };
  if(boldStyle) {
    obj.boldStyle = boldStyle;
  }

  return obj;
};

export default class NotificationsGenerator {
  constructor(store, parent) {
    this.store = store;
    this.parent = parent;
  }
  getUserStringMeta(meta, boldStyle) {
    const { users } = this.parent;
    return boldText('users', users.getNames(meta.get('user_ids'), {
      preferId: meta.getIn(['last_reaction', 'created_by']),
      excludeId: 'me',
      number: 2,
    }), boldStyle);
  }
  getImportantUserIdFromMeta(meta) {
    let userId;
    const type = meta.get('event_type');
    if ([
      'post_reaction_added',
      'post_comment_added',
      'post_comment_reaction_added',
    ].indexOf(type) !== -1) {
      if (meta.getIn(['last_reaction', 'created_by'])) {
        return meta.getIn(['last_reaction', 'created_by']);
      }
      userId = meta.getIn(['user_ids', 0]);
    } else if (['post_created'].indexOf(type) !== -1) {
      userId = meta.get('created_by');
    } else if (['post_comment_mention'].indexOf(type) !== -1) {
      userId = meta.get('mentioned_by');
    } else {
      userId = 'me';
    }
    return userId;
  }
  getStyledTextForNotification(n, boldStyle) {
    const meta = n.get('meta');
    const { users, posts } = this.parent;
    const text = [];
    switch (meta.get('event_type')) {
      case 'step_assigned': {
        const count = meta.get('step_assign_count');
        text.push('You have been assigned to ');
        text.push(boldText('count', `${count} step${count > 1 ? 's' : ''}`, boldStyle));
        text.push(` in: "${meta.get('goal_title')}"`);
        break;
      }
      case 'post_created': {
        text.push(boldText('send', users.getName(meta.get('created_by'), { capitalize: true }), boldStyle));
        text.push(` ${posts.getPostTypeTitle(meta.get('type'))}`);
        text.push(` and tagged `);
        text.push(boldText('users', 'you', boldStyle));
        text.push(`: "${meta.get('message')}"'`);
        break;
      }
      case 'post_reaction_added': {
        text.push(this.getUserStringMeta(meta, boldStyle));
        text.push(` liked your ${meta.get('type')}: "${meta.get('message')}"`);
        break;
      }
      case 'post_comment_added': {
        text.push(this.getUserStringMeta(meta, boldStyle));
        const byMe = meta.get('created_by') === users.getUser('me');
        const preFix = byMe ? 'your ' : posts.getPrefixForType(meta.get('type'));
        const followString = byMe ? '' : ' you follow';
        text.push(` commented on ${preFix}${meta.get('type')}${followString}: "${meta.get('message')}"`);
        break;
      }
      case 'post_comment_reaction_added': {
        text.push(this.getUserStringMeta(meta, boldStyle));
        text.push(` liked your comment: "${meta.get('message')}"`);
        break;
      }
      case 'post_comment_mention': {
        text.push(boldText('send', users.getName(meta.get('mentioned_by'), { capitalize: true }), boldStyle));
        text.push(` mentioned you in a comment`);
        break;
      }
      default: {
        console.log('unknown notification', n.toJS());
      }
    }
    return text;
  }
  getDesktopNotification(n) {
    const meta = n.get('meta');
    const notif = {
      id: n.get('id'),
      target: n.get('target').toJS(),
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
    if (!notif.title) {
      return undefined;
    }
    return notif;
  }
}
