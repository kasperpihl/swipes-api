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
  parseMessage(message) {
    message = message || '';
    return message.replace(/<![A-Z0-9]*\|(.*?)>/gi, (t1, name) => name);
  }
  getStyledTextForNotification(n, boldStyle) {
    const meta = n.get('meta');
    const { users, posts } = this.parent;
    const text = [];
    switch (meta.get('event_type')) {
      case 'goal_assigned': {
        const count = meta.get('step_assign_count') || 0;
        if(count > 0) {
          text.push('You have been assigned to ');
          text.push(boldText('count', `${count} step${count > 1 ? 's' : ''}`, boldStyle));
          text.push(` in: "${meta.get('goal_title')}"`);
        } else {
          text.push(`You've been assigned to the goal: "${meta.get('goal_title')}"`);
        }

        break;
      }
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
        text.push(`: "${this.parseMessage(meta.get('message'))}"'`);
        break;
      }
      case 'post_reaction_added': {
        text.push(this.getUserStringMeta(meta, boldStyle));
        text.push(` liked your ${meta.get('type')}: "${this.parseMessage(meta.get('message'))}"`);
        break;
      }
      case 'post_comment_added': {
        text.push(this.getUserStringMeta(meta, boldStyle));
        const byMe = meta.get('created_by') === users.getUser('me');
        const preFix = byMe ? 'your ' : posts.getPrefixForType(meta.get('type'));
        const followString = byMe ? '' : ' you follow';
        text.push(` commented on ${preFix}${meta.get('type')}${followString}: "${this.parseMessage(meta.get('message'))}"`);
        break;
      }
      case 'post_comment_reaction_added': {
        text.push(this.getUserStringMeta(meta, boldStyle));
        text.push(` liked your comment: "${this.parseMessage(meta.get('message'))}"`);
        break;
      }
      case 'post_comment_mention': {
        text.push(boldText('send', users.getName(meta.get('mentioned_by'), { capitalize: true }), boldStyle));
        text.push(` mentioned you in a comment: "${this.parseMessage(meta.get('comment_message'))}"`);
        break;
      }
      default: {
        console.log('unknown notification', n.toJS());
        text.push('I don\t know what to say (unknown notification)');
      }
    }
    return text;
  }
  getDesktopNotification(n) {
    const meta = n.get('meta');
    if(!meta.get('push')) {
      return undefined;
    }
    const notif = {
      id: n.get('id'),
      target: n.get('target').toJS(),
    };
    switch (meta.get('event_type')) {
      case 'post_created': {
        const name = this.parent.users.getName(meta.get('created_by'), { capitalize: true });
        notif.title = `${name} mentioned you in a post`;
        notif.message = this.parseMessage(meta.get('message'));
        break;
      }
      case 'post_comment_mention': {
        const name = this.parent.users.getName(meta.get('mentioned_by'), { capitalize: true });
        notif.title = `${name} mentioned you in a comment`;
        notif.message = this.parseMessage(meta.get('comment_message'));
        break;
      }
    }
    return notif;
  }
}
