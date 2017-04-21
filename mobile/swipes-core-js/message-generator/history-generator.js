import { Map, List } from 'immutable';
import GoalsUtil from '../classes/goals-util';
import { timeAgo } from '../classes/time-utils';

export default class HistoryGenerator {
  constructor(store, parent) {
    this.store = store;
    this.parent = parent;
  }
  _getGoal(goalId) {
    return this.store.getState().getIn(['goals', goalId]);
  }
  _getHelper(goalId) {
    const me = this.store.getState().get('me');
    const goal = this._getGoal(goalId);
    return new GoalsUtil(goal, me.get('id'));
  }
  getNotificationWrapperForHistory(id, h, options) {
    let def = {
      icon: true,
      timeago: true,
      title: true,
      subtitle: true,
      attachments: true,
      message: true,
      reply: true,
    };
    def = Object.assign(def, options);

    const helper = this._getHelper(id);
    return Map({
      timeago: def.timeago ? timeAgo(h.get('done_at'), true) : null,
      title: def.title ? this.getTitle(helper.getId(), h) : null,
      subtitle: def.subtitle ? this.getSubtitle(helper.getId(), h) : null,
      userId: h.get('done_by'),
      reply: def.reply ? this.getReplyButtonForHistory(helper.getId(), h) : null,
      message: def.message ? h.get('message') : null,
      icon: def.icon ? this.getIcon(h) : null,
      attachments: def.attachments ? this.getAttachments(helper.getId(), h) : null,
    });
  }
  getTitle(id, h) {
    const me = this.store.getState().get('me');
    let from = this.parent.users.getName(h.get('done_by'));
    from = from.charAt(0).toUpperCase() + from.slice(1);
    const helper = this._getHelper(id);

    switch (h.get('type')) {
      case 'goal_created':
      case 'goal_started':
        return `${from} kicked off this goal`;
      case 'goal_completed':
        return `${from} completed this goal`;

      case 'goal_archived':
        return `${from} archived this goal`;

      case 'step_completed': {
        if (h.get('progress') === 'iteration') {
          return `${from} made an iteration`;
        }
        return `${from} completed step`;
      }

      case 'goal_notify': {
        const yourself = h.get('done_by') === me.get('id');

        const to = this.parent.users.getNames(h.get('assignees') || List([me.get('id')]), {
          yourself,
          number: 1,
        });
        const type = h.get('notification_type') || h.getIn(['meta', 'notification_type']);
        if (h.get('request')) {
          if (type === 'update') return `${from} asked ${to} for an update`;
          else if (type === 'feedback') return `${from} asked ${to} for feedback`;
          else if (type === 'assets') return `${from} asked ${to} for assets`;
          else if (type === 'decision') return `${from} asked ${to} for a decision`;
        }
        if (type === 'update') return `${from} gave ${to} an update`;
        else if (type === 'feedback') return `${from} gave ${to} feedback`;
        else if (type === 'assets') return `${from} gave ${to} assets`;
        else if (type === 'decision') return `${from} gave ${to} a decision`;

        return `${from} notified ${to}`;
      }
      case 'milestone_added': {
        return `${from} added the milestone "${msgGen.milestones.getName(h.get('milestone_id'))}"`;
      }
      case 'milestone_removed': {
        return `${from} removed the milestone "${msgGen.milestones.getName(h.get('milestone_id'))}"`;
      }
      default:
        return h.get('type');
    }
  }
  getSubtitle(id, h) {
    const helper = this._getHelper(id);
    switch (h.get('type')) {
      case 'step_completed': {
        const stepTitle = helper.getStepTitleFromId(h.get('to'));
        const fromStepTitle = helper.getStepTitleFromId(h.get('from'));
      }
      default:
        return undefined;
    }
  }
  getReplyButtonForHistory(id, h) {
    const myId = this.store.getState().getIn(['me', 'id']);
    const helper = this._getHelper(id);
    if (!h || !h.get('request') || !h.get('assignees').contains(myId)) {
      return false;
    }
    if (helper.hasIRepliedToHistory(h)) {
      return 'replied';
    }
    return true;
  }
  getAttachments(id, h) {
    const helper = this._getHelper(id);
    return helper.getAttachmentsForFlags(h.get('flags'));
  }
  getIcon(h) {
    switch (h.get('type')) {
      case 'goal_created':
        return 'Plus';

      case 'goal_completed':
        return 'Star';

      case 'goal_archived':
        return 'Archive';

      case 'step_completed':
        return 'ActivityCheckmark';

      case 'goal_notify':
        switch (h.get('notification_type') || h.getIn(['meta', 'notification_type'])) {
          case 'update': return 'Status';
          case 'feedback': return 'Feedback';
          case 'assets': return 'Assets';
          case 'decision': return 'Decision';
          default: return 'GotNotified';
        }


      default:
        return 'GotNotified';
    }
  }
}
