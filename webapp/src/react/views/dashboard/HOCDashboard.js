import React, { Component, PropTypes } from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
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

class HOCDashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
    };
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
    this.onClickCached = setupCachedCallback(this.onClick, this);
    // now use events as onClick: this.onClickCached(i)
    this.callDelegate = setupDelegate(props.delegate);
    this.onMarkCached = setupCachedCallback(this.onMark, this);
  }
  componentDidMount() {
    this.callDelegate('viewDidLoad', this);
  }
  componentWillUnmount() {
    this._unmounted = true;
  }
  onMark(id) {
    const { markNotifications, notifications } = this.props;
    if (notifications.size) {
      let arg = [id];
      if (id === 'all') {
        this.setState({ loading: true });
        arg = notifications.getIn([0, 'ts']);
      }
      if (arg) {
        markNotifications(arg).then(() => {
          if (!this._unmounted) {
            this.setState({ loading: false });
          }
        });
      }
    }
  }
  onClickAttachment(nI, i) {
    const n = this.props.notifications.get(nI);
    const { goals, preview, target } = this.props;
    const aId = n.getIn(['data', 'flags', i]);
    const att = goals.getIn([n.getIn(['data', 'goal_id']), 'attachments', aId]);
    preview(target, att);
  }
  onClickTitle(i) {
    const n = this.props.notifications.get(i);
    this.onMarkCached(n.get('id'))();
    if (n && n.getIn(['data', 'goal_id'])) {
      const { goals, navPush } = this.props;
      const goal = goals.get(n.getIn(['data', 'goal_id']));
      this._dontMark = true;

      if (goal) {
        navPush({
          component: 'GoalOverview',
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
    const { me } = this.props;
    let data = n.get('data');
    data = data || Map();
    const type = n.get('type');

    let m = Map({
      timeago: timeAgo(n.get('ts'), true),
      seen: !!n.get('seen'),
      userId: n.get('done_by'),
    });

    const from = msgGen.getUserString(data.get('done_by'));
    const to = data.get('done_by') === me.get('id') ? 'yourself' : 'you';

    if (data.get('goal_id')) {
      m = m.set('title', this.titleForGoalId(data.get('goal_id')));
      m = m.set('message', data.get('message'));
      m = m.set('attachments', this.getAttachments(data.get('goal_id'), data.get('flags')));
    }
    switch (type) {
      case 'goal_created': {
        m = m.set('subtitle', `${from} created a new goal with you in it`);
        m = m.set('icon', 'Plus');
        break;
      }
      case 'goal_notify': {
        m = m.set('subtitle', `${from} notified ${to} in`);
        m = m.set('icon', 'GotNotified');
        break;
      }
      case 'step_completed': {
        m = m.set('subtitle', `${from} passed this on to ${to}`);
        m = m.set('icon', 'Handoff');
        break;
      }
      case 'goal_completed': {
        m = m.set('subtitle', `${from} completed this goal`);
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
    const { target } = this.props;
    const { loading } = this.state;

    return (
      <div className="dashboard-header">
        <HOCHeaderTitle target={target}>
          <Button loading={loading} text="Mark all" onClick={this.onMarkCached('all')} />
        </HOCHeaderTitle>
        <div className="notifications__header">Notifications</div>
      </div>
    );
  }
  render() {
    let {
      notifications,
    } = this.props;
    if (notifications) {
      notifications = notifications.map(n => this.messageForNotification(n));
    }
    return (
      <SWView header={this.renderHeader()}>
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
    notifications: state.getIn(['main', 'notifications']),
    users: state.get('users'),
    goals: state.get('goals'),
    me: state.get('me'),
  };
}

export default connect(mapStateToProps, {
  markNotifications: actions.main.markNotifications,
  preview: actions.links.preview,
})(HOCDashboard);
