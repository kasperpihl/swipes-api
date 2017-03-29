import React, { PureComponent, PropTypes } from 'react';
import { list, map } from 'react-immutable-proptypes';
import { Map } from 'immutable';
import { connect } from 'react-redux';
import * as actions from 'actions';
import GoalsUtil from 'swipes-core-js/classes/goals-util';
import * as core from 'swipes-core-js/actions';
import { setupDelegate, setupCachedCallback, setupLoading } from 'swipes-core-js/classes/utils';
import { timeAgo } from 'swipes-core-js/classes/time-utils';

import Dashboard from './Dashboard';
/* global msgGen */
const filters = [
  n => n.get('request'),
  n => n.get('receiver') && n.get('important'),
  n => n.get('sender'),
  n => n.get('receiver') && !n.get('important'),
];

class HOCDashboard extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      tabs: ['Requests', 'Notifications', 'Sent', 'Activity'],
      tabIndex: 0,
      notifications: this.getFilteredNotifications(0),
    };
    setupLoading(this);

    this.onClickCached = setupCachedCallback(this.onClick, this);
    // now use events as onClick: this.onClickCached(i)
    this.callDelegate = setupDelegate(props.delegate);
    this.onMarkCached = setupCachedCallback(this.onMark, this);
    this.onScroll = this.onScroll.bind(this);
  }
  componentDidMount() {
    this.callDelegate('viewDidLoad', this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.notifications !== this.props.notifications) {
      this.setState({
        notifications: this.getFilteredNotifications(this.state.tabIndex),
      });
    }
  }
  componentWillUnmount() {
    this._unmounted = true;
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
    }
  }
  onClickTitle(i) {
    const n = this.state.notifications.get(i);
    this.onMarkCached(n.get('id'))();
    if (n && n.getIn(['target', 'id'])) {
      const { goals, navPush } = this.props;
      const goal = goals.get(n.getIn(['target', 'id']));

      if (goal) {
        this.saveState();
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
  getFilteredNotifications(fI) {
    return this.props.notifications.filter(filters[fI]);
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
    const savedState = {
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

  messageForNotification(n) {
    const { me, goals } = this.props;

    const id = n.getIn(['target', 'id']);
    const index = n.getIn(['target', 'history_index']);
    const h = goals.getIn([id, 'history', index]);
    const helper = this.getHelperForId(id);
    const type = n.get('type');

    let m = Map({
      timeago: timeAgo(n.get('updated_at'), true),
      seenAt: !!n.get('seen_at'),
      userId: n.get('done_by'),
    });
    const from = msgGen.users.getName(n.get('done_by'));
    const to = n.get('done_by') === me.get('id') ? 'yourself' : 'you';


    if (h) {
      m = m.set('title', this.titleForGoalId(id));
      m = m.set('message', h.get('message'));
      m = m.set('attachments', this.getAttachments(id, h.get('flags')));
    } else {
      m = m.set('title', `${n.getIn(['meta', 'title'])} (archived)`);
      m = m.set('noClickTitle', !!n.get('seen_at'));
    }

    switch (type) {
      case 'goal_archived': {
        m = m.set('subtitle', `${from} archived`);
        m = m.set('title', `${n.getIn(['meta', 'title'])}`);
        m = m.set('icon', 'Archive');
        break;
      }
      case 'goal_created': {
        m = m.set('subtitle', `${from} created`);
        m = m.set('icon', 'Plus');
        break;
      }
      case 'goal_started': {
        m = m.set('subtitle', `${from} kicked off`);
        m = m.set('icon', 'Plus');
        break;
      }
      case 'goal_notify': {
        m = m.set('subtitle', `${from} sent a notification`);
        if (h && h.get('assignees')) {
          const yourself = h.get('done_by') === me.get('id');
          const userString = msgGen.users.getNames(h.get('assignees'), {
            yourself,
            number: 3,
          });
          m = m.set('subtitle', `${from} notified ${userString} in`);
        }
        if (h && h.get('feedback')) {
          m = m.set('subtitle', `${from} gave ${to} feedback in`);
        }
        m = m.set('icon', 'GotNotified');
        break;
      }
      case 'step_completed': {
        if (!h) {
          m = m.set('subtitle', `${from} completed a step`);
          m = m.set('icon', 'Handoff');
          break;
        }
        const progress = h.get('progress');
        m = m.set('icon', 'Handoff');
        if (progress === 'forward') {
          m = m.set('subtitle', `${from} completed a step in`);
          m = m.set('icon', 'ActivityCheckmark');
          const titles = helper.getStepTitlesBetween(h.get('from'), h.get('to'));
          if (titles.size > 1) {
            m = m.set('subtitle', `${from} completed ${titles.size} steps in`);
          }
        }

        if (progress === 'reassign') {
          m = m.set('subtitle', `${from} reassigned the current step in`);
          m = m.set('icon', 'Iteration');
        }

        if (progress === 'iteration') {
          m = m.set('icon', 'Iteration');
          if (!h.get('from')) {
            m = m.set('subtitle', `${from} restarted the goal`);
          } else {
            m = m.set('subtitle', `${from} made an iteration in`);
          }
        }
        break;
      }
      case 'goal_completed': {
        m = m.set('subtitle', `${from} completed the goal`);
        m = m.set('icon', 'Star');
        break;
      }
      default:
        break;
    }
    if (!m.get('title')) {
      return null;
    }
    return m;
  }

  render() {
    const { tabs, tabIndex } = this.state;
    let { notifications } = this.state;
    if (notifications) {
      notifications = notifications.map(n => this.messageForNotification(n));
    }
    const { savedState } = this.props;
    const initialScroll = (savedState && savedState.get('scrollTop')) || 0;

    return (
      <Dashboard
        delegate={this}
        loadingState={this.getAllLoading()}
        notifications={notifications}
        tabs={tabs}
        tabIndex={tabIndex}
        initialScroll={initialScroll}
      />
    );
  }
}

const { func, object, string } = PropTypes;
HOCDashboard.propTypes = {
  navPush: func,
  savedState: object,
  saveState: func,
  delegate: object,
  notifications: list,
  target: string,
  markNotifications: func,
  preview: func,
  goals: map,
  me: map,
};

function mapStateToProps(state) {
  return {
    notifications: state.get('notifications'),
    users: state.get('users'),
    goals: state.get('goals'),
    me: state.get('me'),
  };
}

export default connect(mapStateToProps, {
  markNotifications: core.notifications.mark,
  preview: actions.links.preview,
})(HOCDashboard);
