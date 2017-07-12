import React, { PureComponent } from 'react'
// import PropTypes from 'prop-types';
// import { map, list } from 'react-immutable-proptypes';
import { bindAll, setupDelegate, setupCachedCallback } from 'swipes-core-js/classes/utils';
import SWView from 'SWView';
// import Button from 'Button';
// import Icon from 'Icon';
import NotificationItem from './NotificationItem';
import './styles/notifications.scss';

class Notifications extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {}
    setupDelegate(this);
    this.callDelegate.bindAll('onMarkAll')
  }
  componentDidMount() {
  }
  renderHeader() {
    return (
      <div className="notifications__header">
        <div className="notifications__title">Notifications</div>
        <div className="notifications__mark-all">Mark all as read</div>
      </div>
    )
  }
  renderNotifications() {
    const { notifications } = this.props;

    return notifications.map((n, i) => (
      <NotificationItem notification={n} key={i} />
    )).toArray();
  }
  render() {
    let className = 'notifications';

    return (
      <div className={className}>
        <SWView
          noframe
          header={this.renderHeader()}
        >
          {this.renderNotifications()}
        </SWView>
      </div>
    )
  }
}

export default Notifications
// const { string } = PropTypes;
Notifications.propTypes = {};
