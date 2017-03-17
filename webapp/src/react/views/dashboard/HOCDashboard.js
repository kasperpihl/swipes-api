import React, { PureComponent, PropTypes } from 'react';
import { list, map } from 'react-immutable-proptypes';
import SWView from 'SWView';
import Button from 'Button';
import { Map, fromJS } from 'immutable';
import { connect } from 'react-redux';
import * as actions from 'actions';
import { setupDelegate, setupCachedCallback } from 'classes/utils';
import { timeAgo } from 'classes/time-utils';
import HOCHeaderTitle from 'components/header-title/HOCHeaderTitle';
import Dashboard from './Dashboard';
/* global msgGen */

class HOCDashboard extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      notifications: this.getFilteredNotifications(props.notifications),
    };
    this.onClickCached = setupCachedCallback(this.onClick, this);
    // now use events as onClick: this.onClickCached(i)
    this.callDelegate = setupDelegate(props.delegate);
    this.onMarkCached = setupCachedCallback(this.onMark, this);
    this.onScroll = this.onScroll.bind(this);
  }
  componentDidMount() {
    this.callDelegate('viewDidLoad', this);
  }
  componentWillUnmount() {
    this._unmounted = true;
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.notifications !== this.props.notifications) {
      this.setState({ notifications: this.getFilteredNotifications(nextProps.notifications) });
    }
  }
  getFilteredNotifications(notifications) {
    return notifications.filter(n => n.get('receiver') && n.get('important'));
  }
  onMark(id) {
    const { markNotifications } = this.props;
    const { notifications } = this.state;
    if (notifications.size) {
      let arg = [id];
      if (id === 'all') {
        arg = notifications.getIn([0, 'updated_at']);
      }
      if (arg) {
        this.setState({ loading: true });
        markNotifications(arg).then(() => {
          if (!this._unmounted) {
            this.setState({ loading: false });
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
    preview(target, att);
  }
  onClickTitle(i) {
    const n = this.state.notifications.get(i);
    this.onMarkCached(n.get('id'))();
    if (n && n.getIn(['target', 'id'])) {
      const { goals, navPush } = this.props;
      const goal = goals.get(n.getIn(['target', 'id']));

      if (goal) {
        console.log('g', goal.toJS());
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
  getAttachments(goalId, flags) {
    const { goals } = this.props;
    const goal = goals.get(goalId);
    if (!goal || !flags || !goal.get('attachments')) {
      return undefined;
    }
    const at = flags.map(fId => (goal.getIn(['attachments', fId, 'title']))).filter(v => !!v);
    return fromJS(at);
  }
  getStepTitles(goalId, from, to) {
    const { goals } = this.props;
    const goal = goals.get(goalId);
    const titles = [];
    if (!goal) {
      return titles;
    }
    let show = false;
    goal.get('step_order').forEach((sI) => {
      if ([from, to].indexOf(sI) !== -1) show = !show;
      if (show) {
        titles.push(goal.getIn(['steps', sI, 'title']));
      }
    });
    return titles;
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
    const name = msgGen.getUserString(userId);
    return <b onClick={this.onClickCached(userId, 'name')}>{name}</b>;
  }

  messageForNotification(n) {
    const { me, goals } = this.props;

    const id = n.getIn(['target', 'id']);
    const index = n.getIn(['target', 'history_index']);
    const h = goals.getIn([id, 'history', index]);
    const type = n.get('type');

    let m = Map({
      timeago: timeAgo(n.get('updated_at'), true),
      seenAt: !!n.get('seen_at'),
      userId: n.get('done_by'),
    });
    const from = msgGen.getUserString(n.get('done_by'));
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
        m = m.set('icon', 'Archived');
        break;
      }
      case 'goal_created': {
        m = m.set('subtitle', `${from} kicked off`);
        m = m.set('icon', 'Plus');
        break;
      }
      case 'goal_notify': {
        m = m.set('subtitle', `${from} sent a notification`);
        if (h && h.get('assignees')) {
          const userString = msgGen.getUserArrayString(h.get('assignees'), {
            yourself: true,
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
          const titles = this.getStepTitles(id, h.get('from'), h.get('to'));
          if (titles.length > 1) {
            m = m.set('subtitle', `${from} completed ${titles.length} steps in`);
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
        m = Map();
        break;
    }
    if (!m.get('title')) {
      return null;
    }
    return m;
  }
  renderHeader() {
    const { loading } = this.state;

    return (
      <div className="dashboard-header">
        <HOCHeaderTitle title="Dashboard">
          <Button loading={loading} text="Mark all" onClick={this.onMarkCached('all')} />
        </HOCHeaderTitle>
        <div className="notifications__header">Notifications</div>
      </div>
    );
  }
  render() {
    let { notifications } = this.state;
    if (notifications) {
      notifications = notifications.map(n => this.messageForNotification(n));
    }
    const { savedState } = this.props;
    const initialScroll = (savedState && savedState.get('scrollTop')) || 0;

    return (
      <SWView
        header={this.renderHeader()}
        onScroll={this.onScroll}
        initialScroll={initialScroll}
      >
        <Dashboard delegate={this} notifications={notifications} />
      </SWView>
    );
  }
}

const { func, object, string } = PropTypes;
HOCDashboard.propTypes = {
  navPush: func,
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
  markNotifications: actions.main.markNotifications,
  preview: actions.links.preview,
})(HOCDashboard);
