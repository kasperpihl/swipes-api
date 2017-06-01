import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { list, map } from 'react-immutable-proptypes';
import { setupDelegate } from 'swipes-core-js/classes/utils';
import SWView from 'SWView';
import TabBar from 'components/tab-bar/TabBar';
import Button from 'Button';
import HOCHeaderTitle from 'components/header-title/HOCHeaderTitle';
import Loader from 'components/loaders/Loader';
import NotificationWrapper from 'components/notification-wrapper/NotificationWrapper';

import './styles/notifications';

export default class Notifications extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasLoaded: false,
    };
    setupDelegate(this);
    this.onMarkAll = this.callDelegate.bind(null, 'onMark', 'all');
    this.onScroll = this.callDelegate.bind(null, 'onScroll');
  }
  componentDidMount() {
    setTimeout(() => {
      this.setState({ hasLoaded: true });
    }, 200);
  }
  componentWillReceiveProps(nextProps) {
    if (this.props.tabIndex !== nextProps.tabIndex) {
      if (this.state.hasLoaded) {
        this.setState({ hasLoaded: false });
      }
    }
  }
  componentDidUpdate() {
    if (!this.state.hasLoaded) {
      setTimeout(() => {
        this.setState({ hasLoaded: true });
      }, 200);
    }
  }
  renderHeader() {
    const { isLoading, tabIndex, numberOfUnread } = this.props;

    const button = tabIndex === 0 ? (
      <Button
        loading={isLoading('all')}
        text="Mark all as read"
        disabled={!numberOfUnread}
        tooltipLabel={!numberOfUnread ? 'All your notifications are already marked as read' : undefined}
        onClick={this.onMarkAll}
      />
    ) : null;

    return (
      <div className="notifications-header">
        <HOCHeaderTitle title="Messages">
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
        return this.renderEmpty();
      }
      return (
        <NotificationWrapper
          notification={n}
          // pinned={tabIndex === 0 && (n.get('reply') === true)}
          i={n.get('index')}
          delegate={delegate}
          key={`notif${n.get('index')}`}
        />
      );
    });
  }
  renderContent() {
    const { hasLoaded } = this.state;

    if (!hasLoaded) {
      return (
        <div className="notifications__loader">
          <svg className="spinner" viewBox="0 0 50 50">
            <circle className="spinner__path" cx="25" cy="25" r="20" fill="none" />
          </svg>
        </div>
      );
    }

    return (
      <div className="notifications">
        {this.renderNotifications()}
      </div>
    );
  }
  render() {
    const { initialScroll } = this.props;
    return (
      <SWView
        header={this.renderHeader()}
        onScroll={this.onScroll}
        initialScroll={initialScroll}
      >
        {this.renderContent()}
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
