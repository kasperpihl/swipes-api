import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { list, map } from 'react-immutable-proptypes';
import { Map, List } from 'immutable';
import { connect } from 'react-redux';
import * as actions from 'actions';
import GoalsUtil from 'swipes-core-js/classes/goals-util';
import * as ca from 'swipes-core-js/actions';
import { setupDelegate, setupCachedCallback, setupLoading } from 'swipes-core-js/classes/utils';

import Notifications from './Notifications';
/* global msgGen */

class HOCNotifications extends PureComponent {
  static minWidth() {
    return 640;
  }
  static maxWidth() {
    return 640;
  }
  constructor(props) {
    super(props);
    let tabIndex = 0;
    if (props.savedState) {
      tabIndex = props.savedState.get('tabIndex') || 0;
    }
    this.state = {
      tabs: ['received', 'sent'], // , 'activity'
      tabIndex,
    };
    this.state.notifications = this.getFilteredNotifications(tabIndex);
    setupLoading(this);

    this.onClickCached = setupCachedCallback(this.onClick, this);
    // now use events as onClick: this.onClickCached(i)
    setupDelegate(this);
    this.onMarkCached = setupCachedCallback(this.onMark, this);
    this.onScroll = this.onScroll.bind(this);
  }
  componentDidMount() {
    this.callDelegate('viewDidLoad', this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.filters !== this.props.filters) {
      const tabIndex = this.state.tabIndex;
      const { notifications, filters } = nextProps;
      this.setState({
        notifications: this.getFilteredNotifications(tabIndex, notifications, filters),
      });
    }
  }
  componentWillUnmount() {
    this._unmounted = true;
  }
  onReply(i) {
    const n = this.state.notifications.get(i);
    this.onMark(n.get('id'));
    const { navPush } = this.props;
    navPush({
      id: 'Notify',
      title: 'Notify',
      props: {
        notify: Map({
          reply_to: n.getIn(['target', 'history_index']),
          notification_type: n.getIn(['meta', 'notification_type']),
          assignees: List([n.get('done_by')]),
        }),
        goalId: n.getIn(['target', 'id']),
      },
    });
  }
  onMark(id) {
    const { markNotifications } = this.props;
    const { notifications } = this.state;
    if (notifications.size) {
      let arg = [id];
      if (id === 'all') {
        arg = notifications.toArray().filter(n => !n.get('seen_at')).map(n => n.get('id'));
      }
      if (arg.length) {
        if (id === 'all') {
          this.setLoading('all');
        }
        markNotifications(arg).then(() => {
          if (!this._unmounted) {
            this.clearLoading('all');
          }
        });
      }
    }
  }
  onScroll(e) {
    this._scrollTop = e.target.scrollTop;
  }
  onClickAttachment(nI, i) {
    const n = this.state.notifications.get(nI);
    const { goals, preview, target } = this.props;
    const id = n.getIn(['target', 'id']);
    const goal = goals.get(id);
    const index = n.getIn(['target', 'history_index']);
    const h = goal.getIn(['history', index]);
    const aId = h.getIn(['flags', i]);
    const att = goal.getIn(['attachments', aId]);
    const selection = window.getSelection();

    if (selection.toString().length === 0) {
      preview(target, att);
      this.onMark(n.get('id'));
      window.analytics.sendEvent('Flag opened', {
        From: 'Notification Feed',
        Type: att.getIn([id, 'link', 'service', 'type']),
        Service: att.getIn([id, 'link', 'service', 'name']),
      });
    }
  }
  onClickTitle(i) {
    const n = this.state.notifications.get(i);
    this.onMark(n.get('id'));
    if (n && n.getIn(['target', 'id'])) {
      const { goals, navPush } = this.props;
      const goal = goals.get(n.getIn(['target', 'id']));

      if (goal) {
        this.saveState();
        window.analytics.sendEvent('Notification opened', {
          Type: n.get('type'),
        });
        navPush({
          id: 'GoalOverview',
          title: goal.get('title'),
          props: {
            goalId: goal.get('id'),
          },
        });
      }
    }
  }
  getHelperForId(goalId) {
    const { me, goals } = this.props;
    return new GoalsUtil(goals.get(goalId), me.get('id'));
  }
  getFilteredNotifications(fI, notifications, filters) {
    notifications = notifications || this.props.notifications;
    filters = filters || this.props.filters;
    const filterId = this.state.tabs[fI];
    return filters.getIn([filterId, 'notifications']).map(i => notifications.get(i));
  }
  getAttachments(goalId, flags) {
    const helper = this.getHelperForId(goalId);
    return helper.getAttachmentsForFlags(flags);
  }
  tabDidChange(index) {
    const { tabIndex } = this.state;

    if (tabIndex !== index) {
      this.setState({
        tabIndex: index,
        notifications: this.getFilteredNotifications(index),
      });
    }
  }
  saveState() {
    const { saveState } = this.props;
    const { tabIndex } = this.state;
    const savedState = {
      tabIndex,
      scrollTop: this._scrollTop,
    }; // state if this gets reopened
    saveState(savedState);
  }
  titleForGoalId(goalId) {
    const { goals } = this.props;
    const title = goals.getIn([goalId, 'title']);
    if (!title) {
      return '(archived)';
    }
    return title;
  }

  clickableNameForUserId(userId) {
    const name = msgGen.users.getName(userId);
    return <b onClick={this.onClickCached(userId, 'name')}>{name}</b>;
  }

  render() {
    const { tabs, tabIndex } = this.state;
    let { notifications } = this.state;
    let numberOfUnread = 0;
    if (notifications) {
      notifications = notifications.map(
        (n, i) => {
          if (n.get('notification') && !n.get('seen_at')) {
            numberOfUnread += 1;
          }
          return msgGen.notifications.getNotificationWrapper(n).set('index', i);
        },
      );

      if (tabIndex === 0) {
        notifications = notifications.sort((n1, n2) => {
          const n1Reply = n1.get('reply') === true;
          const n2Reply = n2.get('reply') === true;
          if (n1Reply && !n2Reply) {
            return -1;
          } else if (n2Reply && !n1Reply) {
            return 1;
          }
          return 0;
        });
      }
    }
    const { savedState, filters } = this.props;
    const initialScroll = (savedState && savedState.get('scrollTop')) || 0;

    return (
      <Notifications
        delegate={this}
        {...this.bindLoading()}
        notifications={notifications}
        numberOfUnread={numberOfUnread}
        tabs={tabs.map((t, i) => {
          let title = filters.getIn([t, 'title']);
          if (filters.getIn([t, 'unread'])) {
            title += ` (${filters.getIn([t, 'unread'])})`;
          }
          return title;
        })}
        tabIndex={tabIndex}
        initialScroll={initialScroll}
      />
    );
  }
}

const { func, object, string } = PropTypes;
HOCNotifications.propTypes = {
  navPush: func,
  savedState: object,
  saveState: func,
  delegate: object,
  notifications: list,
  target: string,
  filters: map,
  markNotifications: func,
  preview: func,
  goals: map,
  me: map,
};

function mapStateToProps(state) {
  return {
    notifications: state.get('notifications'),
    filters: state.getIn(['filters', 'notifications']),
    users: state.get('users'),
    goals: state.get('goals'),
    me: state.get('me'),
  };
}

export default connect(mapStateToProps, {
  markNotifications: ca.notifications.mark,
  preview: actions.links.preview,
})(HOCNotifications);
