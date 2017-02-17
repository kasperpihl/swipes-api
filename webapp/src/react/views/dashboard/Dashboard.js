import React, { Component, PropTypes } from 'react';
import { list } from 'react-immutable-proptypes';
import { setupDelegate } from 'classes/utils';
import NotificationWrapper from './NotificationWrapper';
import './styles/dashboard';

export default class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.callDelegate = setupDelegate(props.delegate);
    this.onClick = this.callDelegate.bind(null, 'onMarkSeen');
  }
  renderNotifications() {
    const { notifications } = this.props;
    if (!notifications) {
      return 'No notifications....';
    }
    return notifications.map((n, i) => {
      if (!n) {
        return null;
      }
      const color = n.get('iconBgColor');
      return (
        <NotificationWrapper
          unread={!n.get('seen')}
          key={`notif${i}`}
          svg={n.get('svg')}
          iconBgColor={color}
          message={n.get('message')}
          timeago={n.get('timeago')}
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
