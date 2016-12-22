import React, { Component, PropTypes } from 'react';
import { list } from 'react-immutable-proptypes';
import NotificationWrapper from './NotificationWrapper';
import './styles/org-dashboard';

class OrgDashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {
  }
  renderNotifications() {
    const { notifications } = this.props;
    if (!notifications) {
      return 'No notifications....';
    }
    return notifications.map((n, i) => (
      <NotificationWrapper
        key={`notif${i}`}
        svg="AddIcon"
        iconBgColor="red"
        message="Kasper added a goal: Test goal"
        timeago="2m ago"
      />
    ));
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

export default OrgDashboard;

const { string } = PropTypes;

OrgDashboard.propTypes = {
  notifications: list,
};
