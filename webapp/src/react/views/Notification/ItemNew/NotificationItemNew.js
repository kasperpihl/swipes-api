import React, { PureComponent } from 'react'
import { setupDelegate } from 'react-delegate';
import { connect } from 'react-redux';
import * as navigationActions from 'src/redux/navigation/navigationActions';
import { navForContext } from 'swipes-core-js/classes/utils';
import * as ca from 'swipes-core-js/actions';
import SplitImage from 'src/react/components/split-image/SplitImage';
import timeAgo from 'swipes-core-js/utils/time/timeAgo';
import SW from './NotificationItemNew.swiss';

const parseUserIds = message => (dispatch, getState) => {
  return message.replace(/<!([A-Z0-9]*)>/gi, (full, uId) => getState().users.getIn([uId, 'profile', 'first_name']));
};
 
export default
@connect(state => ({
  myId: state.me.get('id'),
}), {
  parseUserIds,
  apiRequest: ca.api.request,
  openSecondary: navigationActions.openSecondary,
})
class NotificationItem extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {}
    setupDelegate(this, 'onNotificationOpen');
  }
  onClick = () => {
    const { notification, apiRequest, openSecondary } = this.props;
    const nav = navForContext(notification.get('target'));
    if(!notification.get('seen_at')){
      apiRequest('notifications.markAsSeen', {
        notification_ids: payload,
      })
    }
    if(nav) {
      openSecondary('secondary', nav);
    }
  }
  renderProfilePic() {
    const { notification } = this.props;

    const users = notification.get('done_by');
    return <SplitImage size={48} users={users && users.toJS() || [myId]} />
  }
  render() {
    const { notification, parseUserIds } = this.props;
    const timestamp = timeAgo(notification.get('created_at'), true)
    const text = parseUserIds(notification.get('title'));

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
