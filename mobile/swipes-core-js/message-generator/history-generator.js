import { Map } from 'immutable';
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
    };
    def = Object.assign(def, options);

    const helper = this._getHelper(id);
    return Map({
      timeago: timeAgo(h.get('done_at'), true),
      title: this.parent.history.getTitle(helper.getId(), h),
      subtitle: this.parent.history.getSubtitle(helper.getId(), h),
      seen: !!h.get('seen_at'),
      userId: h.get('done_by'),
      message: h.get('message'),
      icon: def.icon ? this.getIcon(h) : null,
      attachments: this.parent.history.getAttachments(helper.getId(), h),
    });
  }
  getTitle(id, h) {
    const me = this.store.getState().get('me');
    const from = this.parent.users.getName(h.get('done_by'));
    const helper = this._getHelper(id);

    switch (h.get('type')) {
      case 'goal_created':
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

        const to = this.parent.users.getNames(h.get('assignees'), {
          number: 3,
          yourself,
        });

        return `${from} notified ${to}`;
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
        return 'GotNotified';

      default:
        return 'GotNotified';
    }
  }
}
