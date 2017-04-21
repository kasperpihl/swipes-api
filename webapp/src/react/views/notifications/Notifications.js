import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { list, map } from 'react-immutable-proptypes';
import { setupDelegate } from 'swipes-core-js/classes/utils';
import SWView from 'SWView';
import TabBar from 'components/tab-bar/TabBar';
import Button from 'Button';
import HOCHeaderTitle from 'components/header-title/HOCHeaderTitle';

import NotificationWrapper from 'components/notification-wrapper/NotificationWrapper';
import './styles/notifications';

export default class Notifications extends Component {
  constructor(props) {
    super(props);
    setupDelegate(this);
    this.onMarkAll = this.callDelegate.bind(null, 'onMark', 'all');
    this.onScroll = this.callDelegate.bind(null, 'onScroll');
  }
  renderHeader() {
    const { isLoading, tabIndex } = this.props;

    const button = tabIndex === 0 ? (
      <Button loading={isLoading('all')} text="Mark all as read" onClick={this.onMarkAll} />
    ) : null;

    return (
      <div className="notifications-header">
        <HOCHeaderTitle title="Notifications">
          {button}
        </HOCHeaderTitle>
        {this.renderTabbar()}
      </div>
    );
  }
  renderTabbar() {
    const {
      tabIndex,
      tabs,
      delegate,
    } = this.props;

    return (
      <div className="notifications__tab-bar" key="tabbar">
        <TabBar tabs={tabs} delegate={delegate} activeTab={tabIndex} />
      </div>
    );
  }
  renderEmpty() {
    const { notifications } = this.props;
    if (notifications && notifications.size) {
      return undefined;
    }
    return (
      <div className="notifications-empty-state">
        <div className="notifications-empty-state__title">Notifications</div>
        <div className="notifications-empty-state__message">
          Here you get notified on the newest and latest from your team.&nbsp;
          {'Never miss your turn to take action and stay up–to–date with your team\'s progress.'}
        </div>
      </div>
    );
  }
  renderNotifications() {
    const {
      notifications,
      delegate,
      tabIndex,
    } = this.props;

    if (!notifications || !notifications.size) {
      return undefined;
    }

    return notifications.map((n) => {
      if (!n) {
        return null;
      }
      return (
        <NotificationWrapper
          notification={n}
          pinned={tabIndex === 0 && (n.get('reply') === true)}
          i={n.get('index')}
          delegate={delegate}
          key={`notif${n.get('index')}`}
        />
      );
    });
  }
  render() {
    const { initialScroll } = this.props;
    return (
      <SWView
        header={this.renderHeader()}
        onScroll={this.onScroll}
        initialScroll={initialScroll}
      >
        <div className="notifications">
          {this.renderNotifications()}
        </div>
      </SWView>
    );
  }
}
const { object, number, array } = PropTypes;

Notifications.propTypes = {
  initialScroll: number,
  tabIndex: number,
  tabs: array,
  loadingState: map,
  notifications: list,
  delegate: object,
};
