import React, { Component, PropTypes } from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import { list, map } from 'react-immutable-proptypes';
import moment from 'moment';
import { Map } from 'immutable';
import { connect } from 'react-redux';
import * as actions from 'actions';
import { setupDelegate, setupCachedCallback } from 'classes/utils';
import OrgDashboard from './OrgDashboard';

class HOCOrgDashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
    this.onClickCached = setupCachedCallback(this.onClick, this);
    // now use events as onClick: this.onClickCached(i)
    this.callDelegate = setupDelegate(props.delegate);
  }
  componentDidMount() {
    this.callDelegate('viewDidLoad', this);
  }
  onMarkSeen() {
    const { markNotifications, notifications } = this.props;
    if (notifications.size) {
      const first = notifications.first();
      if (!first.get('seen')) {
        markNotifications(first.get('ts')).then((res) => {
          // console.log('lalala', res);
        });
      }
    }
  }
  onClick(id, type) {
    if (type === 'goal') {
      const { goals, navPush } = this.props;
      const goal = goals.get(id);
      navPush({
        component: 'GoalStep',
        title: goal.get('title'),
        props: {
          goalId: id,
        },
      });
    }
  }
  nameForUser(users, id) {
    let name = 'Someone';
    const user = users.get(id);
    if (user) {
      name = user.get('name');
    }
    return name;
  }
  titleForGoalId(goalId) {
    const { goals } = this.props;
    return goals.getIn([goalId, 'title']);
  }
  clickableGoalForId(goalId) {
    const title = this.titleForGoalId(goalId);
    if (!title) {
      return null;
    }
    return <b onClick={this.onClickCached(goalId, 'goal')}>{title}</b>;
  }
  clickableNameForUserId(userId) {
    const { users } = this.props;
    const name = this.nameForUser(users, userId);
    return <b onClick={this.onClickCached(userId, 'name')}>{name}</b>;
  }
  messageForNotification(n) {
    const { ways } = this.props;
    const data = n.get('data');
    const type = data.get('type');
    let m = Map({
      timeago: moment(n.get('ts')).fromNow(),
      seen: n.get('seen'),
    });
    switch (type) {
      case 'goal_created': {
        const goal = this.clickableGoalForId(data.get('goal_id'));
        if (goal) {
          const name = this.clickableNameForUserId(data.get('done_by'));
          m = m.set('message', <span>{name}{' started a goal: '}{goal}</span>);
          m = m.set('svg', 'Plus');
          m = m.set('iconBgColor', '#3893fc');
        }

        break;
      }
      case 'goal_archived': {
        const title = data.get('goal_title');
        const name = this.clickableNameForUserId(data.get('done_by'));
        m = m.set('message', <span>{name}{' archived a goal: '}{title}</span>);
        m = m.set('svg', 'Minus');
        m = m.set('iconBgColor', '#fc7170');
        break;
      }
      case 'step_got_active': {
        const goal = this.clickableGoalForId(data.get('goal_id'));
        if (goal) {
          m = m.set('message', <span>{'It is your turn to act on: '}{goal}</span>);
          m = m.set('svg', 'Deliver');
          m = m.set('iconBgColor', '#3893fc');
        }

        break;
      }
      case 'step_completed': {
        const goal = this.clickableGoalForId(data.get('goal_id'));
        if (goal) {
          const name = this.clickableNameForUserId(data.get('done_by'));
          m = m.set('message', <span>{name}{' completed a step in: '}{goal}</span>);
          m = m.set('svg', 'Checkmark');
          m = m.set('iconBgColor', '#51e389');
        }
        break;
      }
      case 'way_created': {
        const way = ways.get(data.get('way_id'));
        if (way) {
          const name = this.clickableNameForUserId(data.get('done_by'));
          m = m.set('message', <span>{name}{` created a way: ${way.get('title')}`}</span>);
          m = m.set('svg', 'Plus');
          m = m.set('iconBgColor', '#3893fc');
        }
        break;
      }
      default:
        console.log(data.toJS());
        break;
    }
    if (!m.get('message')) {
      return null;
    }
    return m;
  }
  render() {
    let {
      notifications,
    } = this.props;
    if (notifications) {
      notifications = notifications.map(n => this.messageForNotification(n));
    }
    return (
      <OrgDashboard notifications={notifications} />
    );
  }
}

const { func, object } = PropTypes;
HOCOrgDashboard.propTypes = {
  navPush: func,
  delegate: object,
  notifications: list,
  markNotifications: func,
  ways: map,
  goals: map,
};

function mapStateToProps(state) {
  return {
    notifications: state.getIn(['main', 'notifications']),
    users: state.get('users'),
    ways: state.getIn(['main', 'ways']),
    goals: state.get('goals'),
    me: state.get('me'),
  };
}

export default connect(mapStateToProps, {
  markNotifications: actions.main.markNotifications,
})(HOCOrgDashboard);
