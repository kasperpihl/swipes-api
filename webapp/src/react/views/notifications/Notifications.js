import React, { PureComponent } from 'react'
// import PropTypes from 'prop-types';
// import { map, list } from 'react-immutable-proptypes';
import { setupDelegate } from 'react-delegate';
import SWView from 'SWView';
import Button from 'Button';
// import Icon from 'Icon';
import NotificationItem from './NotificationItem';
import './styles/notifications.scss';

const DISTANCE = 50;

class Notifications extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {}
    setupDelegate(this, 'onMarkAll', 'onReachedEnd');
    this.lastEnd = 0;
    this.onScroll = this.onScroll.bind(this);
  }
  componentDidMount() {
  }
  onScroll(e) {
    if (e.target.scrollTop > e.target.scrollHeight - e.target.clientHeight - DISTANCE) {
      if (this.lastEnd < e.target.scrollTop + DISTANCE) {
        this.onReachedEnd();
        this.lastEnd = e.target.scrollTop;
      }
    }

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
    const { notifications, delegate, limit } = this.props;

    return notifications.map((n, i) => (
      (i < limit) ? <NotificationItem notification={n} key={i} delegate={delegate}/> : null
    )).toArray();
  }
  render() {
    let className = 'notifications';

    return (
      <div className={className}>
        <SWView
          noframe
          header={this.renderHeader()}
          onScroll={this.onScroll}
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
