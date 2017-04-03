import React, { PureComponent, PropTypes } from 'react';
import { map } from 'react-immutable-proptypes';
import NotificationWrapper from 'components/notification-wrapper/NotificationWrapper';
/* global msgGen */

class ActivityFeed extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {
  }
  renderActivity() {
    const { goal, delegate } = this.props;
    const opts = {
      icon: false,
    };
    return goal.get('history').map(h => (
      <NotificationWrapper
        notification={msgGen.history.getNotificationWrapperForHistory(goal.get('id'), h, opts)}
        delegate={delegate}
      />
    ));
  }
  render() {
    return (
      <div className="activity-feed">
        {this.renderActivity()}
      </div>
    );
  }
}

export default ActivityFeed;

const { object } = PropTypes;

ActivityFeed.propTypes = {
  goal: map,
  delegate: object,
};
