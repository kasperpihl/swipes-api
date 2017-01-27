import React, { Component, PropTypes } from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import { list } from 'react-immutable-proptypes';
import { Map } from 'immutable';
import { connect } from 'react-redux';
import * as actions from 'actions';
import { setupDelegate, setupCachedCallback } from 'classes/utils';
import OrgDashboard from './OrgDashboard';
import moment from 'moment';

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
      console.log('clicked goal', id);
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
    return <b onClick={this.onClickCached(goalId, 'goal')}>{title}</b>;
  }
  clickableNameForUserId(userId) {
    const { users } = this.props;
    const name = this.nameForUser(users, userId);
    return <b onClick={this.onClickCached(userId, 'name')}>{name}</b>;
  }
  messageForNotification(n) {
    const data = n.get('data');
    const type = data.get('type');
    let m = Map({
      timeago: moment(n.get('ts')).fromNow(),
    });
    switch (type) {
      case 'goal_created': {
        const goal = this.clickableGoalForId(data.get('goal_id'));
        const name = this.clickableNameForUserId(data.get('done_by'));
        m = m.set('message', <span>{name}{' started a goal: '}{goal}</span>);
        m = m.set('svg', 'Plus');
        m = m.set('iconBgColor', '#3893fc');
        break;
      }
      case 'goal_archived': {
        const goal = this.clickableGoalForId(data.get('goal_id'));
        const name = this.clickableNameForUserId(data.get('done_by'));
        m = m.set('message', <span>{name}{' archived a goal: '}{goal}</span>);
        m = m.set('svg', 'Minus');
        m = m.set('iconBgColor', '#fc7170');
        break;
      }
      case 'step_got_active': {
        const goal = this.clickableGoalForId(data.get('goal_id'));
        m = m.set('message', <span>{'It is your turn to act on: '}{goal}</span>);
        m = m.set('svg', 'Deliver');
        m = m.set('iconBgColor', '#3893fc');
        break;
      }
      case 'step_completed': {
        const goal = this.clickableGoalForId(data.get('goal_id'));
        const name = this.clickableNameForUserId(data.get('done_by'));
        m = m.set('message', <span>{name}{' completed a step in: '}{goal}</span>);
        m = m.set('svg', 'Checkmark');
        m = m.set('iconBgColor', '#51e389');
        break;
      }
      default:
        console.log(data.toJS());
        break;
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
  navPush: actions.navigation.push,
})(HOCOrgDashboard);
