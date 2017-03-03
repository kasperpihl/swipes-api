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

    if (!notifications.size) {
      return (
        <div className="notifications-empty-state">
          <div className="notifications-empty-state__title">Notifications</div>
          <div className="notifications-empty-state__message">Here you get notified on the newest and latest from your team. Never miss your turn to take action and stay up–to–date with your team's progress.</div>
        </div>
      );
    }
    return notifications.map((n, i) => {
      if (!n) {
        return null;
      }
      return (
        <NotificationWrapper
          notification={n}
          i={i}
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
