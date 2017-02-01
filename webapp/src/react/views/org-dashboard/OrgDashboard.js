import React, { Component, PropTypes } from 'react';
import { list } from 'react-immutable-proptypes';
import { setupDelegate } from 'classes/utils';

import NotificationWrapper from './NotificationWrapper';
import UnreadBar from './UnreadBar';
import './styles/org-dashboard';

export default class OrgDashboard extends Component {
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
  renderUnreadBar() {
    const { notifications } = this.props;
    if (!notifications) {
      return undefined;
    }
    const numberOfUnreads = notifications.filter(n => n && !n.get('seen')).size;
    if (!numberOfUnreads) {
      return undefined;
    }
    let title = `You have ${numberOfUnreads} unread notification`;
    if (numberOfUnreads > 1) title += 's';
    return <UnreadBar title={title} onClick={this.onClick} />;
  }
  render() {
    return (
      <div className="org-dashboard">
        <div className="notifications__header">Notifications</div>
        <div className="notifications__list">
          {this.renderNotifications()}
        </div>
        {this.renderUnreadBar()}
      </div>
    );
  }
}
const { object } = PropTypes;
OrgDashboard.propTypes = {
  notifications: list,
  delegate: object,
};
