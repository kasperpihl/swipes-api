import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { map } from 'react-immutable-proptypes';
import NotificationWrapper from 'components/notification-wrapper/NotificationWrapper';
/* global msgGen */

class ActivityFeed extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }
  renderActivity() {
    const { goal, delegate } = this.props;
    const opts = {
    };
    return goal.get('history').reverse().map((h, i) => (
      <NotificationWrapper
        notification={msgGen.history.getNotificationWrapperForHistory(goal.get('id'), h, opts)}
        delegate={delegate}
        key={i}
        i={i}
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
