import React, { PureComponent } from 'react'
// import PropTypes from 'prop-types';
// import { map, list } from 'react-immutable-proptypes';
import { setupDelegate } from 'react-delegate';
import SWView from 'SWView';
import Button from 'Button';
// import Icon from 'Icon';
import NotificationItem from './NotificationItem';
import './styles/notifications.scss';

class Notifications extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {}
    setupDelegate(this, 'onMarkAll');
  }
  componentDidMount() {
  }
  renderHeader() {
    const { getLoading } = this.props;
    return (
      <div className="notifications__header">
        <div className="notifications__title">Notifications</div>
        <Button
          text="Mark all as read"
          frameless
          small
          onClick={this.onMarkAll}
          className="notifications__mark-all"
          {...getLoading('marking')}
        />
      </div>
    )
  }
  renderNotifications() {
    const { notifications, delegate } = this.props;

    return notifications.map((n, i) => (
      <NotificationItem notification={n} key={i} delegate={delegate}/>
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
