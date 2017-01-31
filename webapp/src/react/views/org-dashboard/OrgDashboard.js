import React, { Component } from 'react';
import { list } from 'react-immutable-proptypes';
import NotificationWrapper from './NotificationWrapper';
import './styles/org-dashboard';

export default class OrgDashboard extends Component {
  renderNotifications() {
    const { notifications } = this.props;
    if (!notifications) {
      return 'No notifications....';
    }
    return notifications.map((n, i) => {
      if (!n) {
        return null;
      }
      return (
        <NotificationWrapper
          key={`notif${i}`}
          svg={n.get('svg')}
          iconBgColor={n.get('iconBgColor')}
          message={n.get('message')}
          timeago={n.get('timeago')}
        />
      );
    });
  }
  render() {
    return (
      <div className="org-dashboard">
        <div className="notifications__header">Notifications</div>
        <div className="notifications__list">
          {this.renderNotifications()}
        </div>
      </div>
    );
  }
}

OrgDashboard.propTypes = {
  notifications: list,
};
