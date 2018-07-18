import React, { PureComponent } from 'react'
import { setupDelegate } from 'react-delegate';
import EmptyState from 'src/react/components/empty-state/EmptyState';
import SWView from 'SWView';
import Button from 'src/react/components/button/Button';
import NotificationItem from '../Item/NotificationItem';
import SW from './NotificationList.swiss';

const DISTANCE = 50;

export default class NotificationList extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {}
    setupDelegate(this, 'onMarkAll', 'onReachedEnd');
    this.lastEnd = 0;
    this.onScroll = this.onScroll.bind(this);
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
      <SW.Header>
        <SW.Title>Notifications</SW.Title>
        <Button
          title="Mark all as read"
          compact
          onClick={this.onMarkAll}
          {...getLoading('marking')}
        />
      </SW.Header>
    )
  }
  renderEmptyState() {

    return (
      <EmptyState
        icon="ESNotifications"
        title="IT’S STILL AND QUIET"
        description={`You will be notified here when there’s \n something new.`}
      />
    )
  }
  renderNotifications() {
    const { notifications, delegate, limit } = this.props;

    if (!notifications.size) {
      return this.renderEmptyState()
    }

    return notifications.map((n, i) => (
      (i < limit) ? <NotificationItem notification={n} key={i} delegate={delegate}/> : null
    )).toArray();
  }
  render() {

    return (
      <SW.Wrapper>
        <SWView
          noframe
          header={this.renderHeader()}
          onScroll={this.onScroll}
        >
          {this.renderNotifications()}
        </SWView>
      </SW.Wrapper>
    )
  }
}
