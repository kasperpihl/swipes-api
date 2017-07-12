import React, { PureComponent } from 'react'
// import PropTypes from 'prop-types';
// import { map, list } from 'react-immutable-proptypes';
import { bindAll, setupDelegate, setupCachedCallback } from 'swipes-core-js/classes/utils';
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
  renderProfilePic() {
    // const { myId } = this.props;

    const image = msgGen.users.getPhoto('me');
    const initials = msgGen.users.getInitials('me')

    if (image) {
      return <img src={image} className="comment-input__image" />
    }

    return <div className="comment-input__initials">{initials}</div>
  }
  render() {
    const { notification } = this.props;
    // const text = msgGen.notifications.getStyledTextForNotification(notification);
    const text = [
      'Yana mentioned ',
      {
        id: 'lakusgh',
        string: 'you and 3 others'
      },
      ' in a message: “I just finished with the…'
    ]

    return (
      <div className="notification-item" onClick={this.onNotificationOpen}>
        {this.renderProfilePic()}
        <StyledText text={text} />
      </div>
    )
  }
}

export default NotificationItem
// const { string } = PropTypes;
NotificationItem.propTypes = {};
