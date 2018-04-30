import React, { PureComponent } from 'react'
import { setupDelegate } from 'react-delegate';
import { bindAll, setupCachedCallback } from 'swipes-core-js/classes/utils';
import timeAgo from 'swipes-core-js/utils/time/timeAgo';
import StyledText from 'components/styled-text/StyledText';
import './styles/notification-item.scss';

class NotificationItem extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {}
    setupDelegate(this, 'onNotificationOpen');
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
          <div className="notification-item__message">
            <StyledText text={text} className="notification-item__styled-text" />
          </div>
          <div className="notification-item__timestamp">{timestamp}</div>
        </div>
      </div>
    )
  }
}

export default NotificationItem;
