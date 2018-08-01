import React, { PureComponent } from 'react'
import { setupDelegate } from 'react-delegate';
import { connect } from 'react-redux';
import SplitImage from 'src/react/components/split-image/SplitImage';
import timeAgo from 'swipes-core-js/utils/time/timeAgo';
import SW from './NotificationItemNew.swiss';

export default
@connect(state => ({
  myId: state.me.get('id'),
}))
class NotificationItem extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {}
    setupDelegate(this, 'onNotificationOpen');
  }
  renderProfilePic() {
    const { notification } = this.props;

    const users = notification.get('done_by');
    return <SplitImage size={48} users={users && users.toJS() || [myId]} />
  }
  render() {
    const { notification } = this.props;
    const timestamp = timeAgo(notification.get('created_at'), true)
    const text = notification.get('title');

    return (
      <SW.Wrapper unread={!!notification.get('seen_at')} onClick={this.onNotificationOpenCached(notification)}>
        {this.renderProfilePic()}
        <SW.Content>
          <SW.Message>
            <SW.Text>{text}</SW.Text>
          </SW.Message>
          <SW.TimeStamp>{timestamp}</SW.TimeStamp>
        </SW.Content>
      </SW.Wrapper>
    )
  }
}
