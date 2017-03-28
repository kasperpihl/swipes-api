import React, { Component, PropTypes } from 'react';
import { list, map } from 'react-immutable-proptypes';
import { setupDelegate } from 'swipes-core-js/classes/utils';
import SWView from 'SWView';
import TabBar from 'components/tab-bar/TabBar';
import Button from 'Button';
import HOCHeaderTitle from 'components/header-title/HOCHeaderTitle';

import NotificationWrapper from './NotificationWrapper';
import './styles/dashboard';

export default class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.callDelegate = setupDelegate(props.delegate);
    this.onMarkAll = this.callDelegate.bind(null, 'onMark', 'all');
    this.onScroll = this.callDelegate.bind(null, 'onScroll');
  }
  renderHeader() {
    const { loadingState } = this.props;
    const loading = loadingState.get('all') && loadingState.get('all').loading;
    return (
      <div className="dashboard-header">
        <HOCHeaderTitle title="Dashboard">
          <Button loading={loading} text="Mark all" onClick={this.onMarkAll} />
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
      <div className="dashboard__tab-bar" key="tabbar">
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
    } = this.props;

    if (!notifications || !notifications.size) {
      return undefined;
    }

    return notifications.map((n, i) => {
      if (!n) {
        return null;
      }
      return (
        <NotificationWrapper
          notification={n}
          i={i}
          delegate={delegate}
          key={`notif${i}`}
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
        <div className="dashboard">
          <div className="dashboard__notifications">
            {this.renderNotifications()}
          </div>
        </div>
      </SWView>
    );
  }
}
const { object, number, array } = PropTypes;

Dashboard.propTypes = {
  initialScroll: number,
  tabIndex: number,
  tabs: array,
  loadingState: map,
  notifications: list,
  delegate: object,
};
