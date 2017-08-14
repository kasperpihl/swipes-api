import React, { PureComponent } from 'react'
// import PropTypes from 'prop-types';
// import { map, list } from 'react-immutable-proptypes';
import { setupDelegate } from 'react-delegate';
import { bindAll, setupCachedCallback } from 'swipes-core-js/classes/utils';
import { timeAgo } from 'swipes-core-js/classes/time-utils';
// import SWView from 'SWView';
// import Button from 'Button';
// import Icon from 'Icon';
import StyledText from 'components/styled-text/StyledText';
import './styles/notification-item.scss';

class NotificationItem extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {}
    setupDelegate(this, 'onNotificationOpen');
  }
  componentDidMount() {
  }
  renderProfilePic() {
    const { notification: n } = this.props;

    const userId = msgGen.notifications.getImportantUserIdFromMeta(n.get('meta'));
    const image = msgGen.users.getPhoto(userId);
    const initials = msgGen.users.getInitials(userId);

    if (image) {
      return <img src={image} className="notification-item__image" />
    }

    return <div className="notification-item__initials">{initials}</div>
  }
  render() {
    const { notification: n } = this.props;
    //
    let className = 'notification-item';
    const timestamp = timeAgo(n.get('created_at'), true)
    const text = msgGen.notifications.getStyledTextForNotification(n);

    if (!n.get('seen_at')) {
      className += ' notification-item--unread';
    }

    return (
      <div className={className} onClick={this.onNotificationOpenCached(n)}>
        {this.renderProfilePic()}
        <div className="notification-item__content">
          <StyledText text={text} className="notification-item__styled-text" />
          <div className="notification-item__timestamp">{timestamp}</div>
        </div>
      </div>
    )
  }
}

export default NotificationItem
// const {string} = PropTypes;
NotificationItem.propTypes = {};
