import React, { PureComponent } from 'react'
// import PropTypes from 'prop-types';
// import { map, list } from 'react-immutable-proptypes';
// import { bindAll, setupDelegate, setupCachedCallback } from 'swipes-core-js/classes/utils';
// import SWView from 'SWView';
// import Button from 'Button';
// import Icon from 'Icon';
import StyledText from 'components/styled-text/StyledText';
import './styles/notification-item.scss';

class NotificationItem extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {}
    setupDelegate(this);
    this.callDelegate.bindAll('onNotificationOpen')
  }
  componentDidMount() {
  }
  render() {
    const { notification } = this.props;
    const text = msgGen.notifications.getStyledTextForNotification(notification);

    return (
      <div className="notification-item" onClick={this.onNotificationOpen}>
        <StyledText text={text} />
      </div>
    )
  }
}

export default NotificationItem
// const { string } = PropTypes;
NotificationItem.propTypes = {};
