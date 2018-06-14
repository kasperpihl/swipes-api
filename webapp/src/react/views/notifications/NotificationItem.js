import React, { PureComponent } from 'react'
import { setupDelegate } from 'react-delegate';
import { bindAll, setupCachedCallback } from 'swipes-core-js/classes/utils';
import { styleElement } from 'swiss-react';
import timeAgo from 'swipes-core-js/utils/time/timeAgo';
import StyledText from 'components/styled-text/StyledText';
import styles from './Notificationitem.swiss';

const Wrapper = styleElement('div', styles.Wrapper);
const NotificationImage = styleElement('img', styles.NotificationImage);
const Initials = styleElement('div', styles.Initials);
const Content = styleElement('div', styles.Content);
const TimeStamp = styleElement('div', styles.TimeStamp);
const Message = styleElement('div', styles.Message);
const Text = styleElement(StyledText, styles.Text);
const StyledButton = styleElement('div', styles.StyledButton);

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
      return <NotificationImage src={image} />
    }

    return <Initials>{initials}</Initials>
  }
  render() {
    const { notification: n } = this.props;
    const timestamp = timeAgo(n.get('created_at'), true)
    const text = msgGen.notifications.getStyledTextForNotification(n);

    return (
      <Wrapper unread={!n.get('seen_at') ? true : ''} onClick={this.onNotificationOpenCached(n)}>
        {this.renderProfilePic()}
        <Content>
          <Message>
            <Text text={text}/>
          </Message>
          <TimeStamp>{timestamp}</TimeStamp>
        </Content>
      </Wrapper>
    )
  }
}

export default NotificationItem;
