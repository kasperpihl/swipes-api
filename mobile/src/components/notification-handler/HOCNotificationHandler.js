import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import * as a from '../../actions';

class HOCNotificationHandler extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }
  openNotify() {
    const { groupId, notifications } = this.props;

    if (groupId) {
      const notification = notifications.find(n => n.get('group_id') === groupId);

      console.log('notification', notification);

      if (notification) {
        navPush({
          id: 'Notify',
          title: 'Notify',
          props: {
            notify: Map({
              reply_to: notification.getIn(['target', 'history_index']),
              notification_type: notification.getIn(['meta', 'notification_type']),
              assignees: List([notification.get('done_by')]),
            }),
            goalId: notification.getIn(['target', 'id']),
          },
        });
      }
    }

    return null;
  }
  render() {
    return this.openNotify();
  }
}

function mapStateToProps(state) {
  return {
    notifications: state.get('notifications'),
  };
}

export default connect(mapStateToProps, {
  navPush: a.navigation.push,
})(HOCNotificationHandler);
