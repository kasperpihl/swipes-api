import React, { PureComponent } from 'react'
import { setupDelegate } from 'react-delegate';
import { bindAll, setupCachedCallback } from 'swipes-core-js/classes/utils';
import timeAgo from 'swipes-core-js/utils/time/timeAgo';
import SW from './Notificationitem.swiss';

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
      return <SW.NotificationImage src={image} />
    }

    return <SW.Initials>{initials}</SW.Initials>
  }
  render() {
    const { notification: n } = this.props;
    const timestamp = timeAgo(n.get('created_at'), true)
    const text = msgGen.notifications.getStyledTextForNotification(n);

    return (
      <SW.Wrapper unread={!n.get('seen_at') ? true : ''} onClick={this.onNotificationOpenCached(n)}>
        {this.renderProfilePic()}
        <SW.Content>
          <SW.Message>
            <SW.Text text={text}/>
          </SW.Message>
          <SW.TimeStamp>{timestamp}</SW.TimeStamp>
        </SW.Content>
      </SW.Wrapper>
    )
  }
}

export default NotificationItem;
