import React, { Component, PropTypes } from 'react';
import { list } from 'react-immutable-proptypes';
import NotificationWrapper from './NotificationWrapper';
import './styles/dashboard';

export default class Dashboard extends Component {
  constructor(props) {
    super(props);
  }
  renderNotifications() {
    const {
      notifications,
      delegate,
    } = this.props;

    if (!notifications) {
      return 'No notifications....';
    }
    return notifications.map((n, i) => {
      if (!n) {
        return null;
      }
      return (
        <NotificationWrapper
          notification={n}
          delegate={delegate}
          key={`notif${i}`}
        />
      );
    });
  }
  render() {
    return (
      <div className="dashboard">
        <div className="dashboard__notifications">
          {this.renderNotifications()}
        </div>
      </div>
    );
  }
}
const { object } = PropTypes;
Dashboard.propTypes = {
  notifications: list,
  delegate: object,
};
