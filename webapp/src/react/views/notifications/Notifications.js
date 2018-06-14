import React, { PureComponent } from 'react'
import { setupDelegate } from 'react-delegate';
import { styleElement } from 'swiss-react';
import SWView from 'SWView';
import Button from 'src/react/components/button/Button';
import Icon from 'Icon';
import NotificationItem from './NotificationItem';
import styles from './Notifications.swiss';

const Wrapper = styleElement('div', styles.Wrapper);
const Header = styleElement('div', styles.Header);
const Title = styleElement('div', styles.Title);
const EmptyState = styleElement('div', styles.EmptyState);
const EmptyIllustration = styleElement('div', styles.EmptyIllustration);
const EmptySVG = styleElement(Icon, styles.EmptySVG);
const EmptyTitle = styleElement('div', styles.EmptyTitle);
const EmptyText = styleElement('div', styles.EmptyText);

const DISTANCE = 50;

class Notifications extends PureComponent {
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
      <Header>
        <Title>Notifications</Title>
        <Button
          title="Mark all as read"
          compact
          onClick={this.onMarkAll}
          {...getLoading('marking')}
        />
      </Header>
    )
  }
  renderEmptyState() {

    return (
      <EmptyState>
        <EmptyIllustration>
          <EmptySVG icon="ESNotifications"/>
        </EmptyIllustration>
        <EmptyTitle>
          It’s still and quiet
        </EmptyTitle>
        <EmptyText>
          You will be notified here when there’s <br /> something new.
        </EmptyText>
      </EmptyState>
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
      <Wrapper>
        <SWView
          noframe
          header={this.renderHeader()}
          onScroll={this.onScroll}
        >
          {this.renderNotifications()}
        </SWView>
      </Wrapper>
    )
  }
}

export default Notifications;
