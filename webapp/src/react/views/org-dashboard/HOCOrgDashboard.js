import React, { Component, PropTypes } from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import { list } from 'react-immutable-proptypes';
import { Map } from 'immutable';
import { connect } from 'react-redux';
import * as actions from 'actions';
import { setupDelegate } from 'classes/utils';
import OrgDashboard from './OrgDashboard';

class HOCOrgDashboard extends Component {
  static contextButtons() {
    return [{
      component: 'Button',
      props: {
        icon: 'ArrowRightIcon',
        text: 'View Goals',
        alignIcon: 'right',
      },
    }];
  }
  constructor(props) {
    super(props);
    this.state = {};
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
    this.callDelegate = setupDelegate(props.delegate);
  }
  componentDidMount() {
    this.callDelegate('viewDidLoad', this);
  }
  onContextClick() {
    const {
      navPush,
    } = this.props;
    navPush({
      component: 'GoalList',
      title: 'Goals',
      props: {
      },
    });
  }
  nameForUser(users, id) {
    let name = 'Someone';
    const user = users.get(id);
    if (user) {
      name = user.get('name');
    }
    return name;
  }
  messageForNotification(n) {
    const { users } = this.props;
    const data = n.get('data');
    const type = data.get('type');

    let m = Map();
    switch (type) {
      case 'goal_created': {
        const name = this.nameForUser(users, data.get('created_by'));
        m = m.set('message', <span><b>{name}</b>{' started a goal: '}<b>{data.get('title')}</b></span>);
        m = m.set('svg', 'AddIcon');
        m = m.set('iconBgColor', '#3893fc');
        break;
      }
      case 'goal_deleted': {
        const name = this.nameForUser(users, data.get('created_by'));
        m = m.set('message', <span><b>{name}</b>{' deleted a goal: '}<b>{data.get('title')}</b></span>);
        m = m.set('svg', 'MinusIcon');
        m = m.set('iconBgColor', '#fc7170');
        break;
      }
      case 'step_got_active': {
        m = m.set('message', <span>{'It is your turn to act on: '}<b>{data.get('title')}</b></span>);
        m = m.set('svg', 'DeliverIcon');
        m = m.set('iconBgColor', '#3893fc');
        break;
      }
      case 'step_completed': {
        const name = this.nameForUser(users, data.get('created_by'));
        m = m.set('message', <span><b>{name}</b>{' completed a step in: '}<b>{data.get('title')}</b></span>);
        m = m.set('svg', 'CheckmarkIcon');
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
  };
}

export default connect(mapStateToProps, {
  navPush: actions.navigation.push,
})(HOCOrgDashboard);
