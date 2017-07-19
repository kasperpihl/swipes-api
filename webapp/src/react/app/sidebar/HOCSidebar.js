import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { map } from 'react-immutable-proptypes';
import Icon from 'Icon';
import HOCAssigning from 'components/assigning/HOCAssigning';
import * as a from 'actions';
import { setupCachedCallback } from 'swipes-core-js/classes/utils';
import HOCNotifications from 'views/notifications/HOCNotifications';

import './styles/sidebar.scss';

class HOCSidebar extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isOpenNotifications: false,
    };
    this.onClickCached = setupCachedCallback(this.onClick, this);
    this.onRightClickCached = setupCachedCallback(this.onClick, this);
  }
  onClick(id, target, e) {
    const { navSet } = this.props;
    if (target === 'secondary' && id === 'Slack') {
      return;
    }

    if (id === 'Notifications') {
      this.openNotifications(e);
      return;
    }

    navSet(target, {
      id,
      title: this.getTitleForId(id),
    });
  }
  getNavItems() {
    return [
      { id: 'GoalList', svg: 'Goals' },
      { id: 'MilestoneList', svg: 'Milestones' },
      { id: 'PostFeed', svg: 'Messages' },
      this.getRemainingOnboarding() ? { id: 'Onboarding', svg: 'Onboarding' } : undefined,
      // { id: 'Find', svg: 'Find' },
      // { id: 'Slack', svg: 'Hashtag' },
      // { id: 'Store', svg: 'Store' },
    ].filter(v => !!v);
  }
  getTitleForId(id) {
    switch (id) {
      case 'PostFeed':
        return 'Discuss';
      case 'MilestoneList':
        return 'Plan';
      case 'GoalList':
        return 'Take Action';
      case 'AccountList':
        return 'Account';
      case 'Notifications':
        return 'Notifications';
      default:
        return id;
    }
  }
  getRemainingOnboarding() {
    const { me } = this.props;
    const order = me.getIn(['settings', 'onboarding', 'order']);
    const completed = me.getIn(['settings', 'onboarding', 'completed']);
    return order.filter(id => !completed.get(id)).size;
  }
  openNotifications(e) {
    const { contextMenu } = this.props;
    const options = {
      boundingRect: e.target.getBoundingClientRect(),
      alignY: 'top',
      alignX: 'left',
      excludeX: true,
      positionX: 12,

    };
    this.setState({ isOpenNotifications: true });
    contextMenu({
      component: HOCNotifications,
      onClose: () => { this.setState({ isOpenNotifications: false }); },
      options,
    })
  }
  renderItem(item) {
    const { navId, notificationCounter } = this.props;
    const { isOpenNotifications: isOpen } = this.state
    let counter = 0;
    if (item.id === 'Onboarding') {
      counter = this.getRemainingOnboarding();
    } else if(item.id === 'Notifications') {
      counter = notificationCounter;
    }
    let className = 'sidebar__item';
    if (isOpen && item.id === 'Notifications' || !isOpen && item.id === navId) {
      className += ' sidebar__item--active';
    }

    let notif = null;
    if (counter) {
      notif = <div className="sidebar__notification">{counter}</div>;
    }

    let image = <Icon icon={item.svg} className="sidebar__icon" />;

    if (item.id === 'AccountList') {
      image = <HOCAssigning assignees={[item.personId]} rounded size={44} />;
    }

    return (
      <div
        onClick={this.onClickCached(item.id, 'primary')}
        onContextMenu={this.onRightClickCached(item.id, 'secondary')}
        className={className}
        key={item.id}
        data-id={item.id}
        data-title={this.getTitleForId(item.id)}
      >
        {image}
        {notif}
      </div>
    );
  }

  // render
  renderMiddleSection() {
    const navItems = this.getNavItems();

    if (navItems) {
      return navItems.map((o, i) => this.renderItem(o, i));
    }

    return undefined;
  }
  renderProfile() {
    const { me } = this.props;

    if (!me) {
      return undefined;
    }

    return this.renderItem({ id: 'AccountList', personId: me.get('id') });
  }
  renderStore() {
    // For later
  }
  render() {
    return (
      <div className="sidebar">
        <div className="sidebar__top-section">
          {this.renderItem({ id: 'Notifications', svg: 'Notification' })}
        </div>
        <div className="sidebar__middle-section">
          <div className="sidebar__section">
            {this.renderMiddleSection()}
          </div>
        </div>
        <div className="sidebar__bottom-section">
          {this.renderProfile()}
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    me: state.get('me'),
    navId: state.getIn(['navigation', 'primary', 'id']),
    notificationCounter: state.getIn(['connection', 'notificationCounter']),
  };
}


const { string, func } = PropTypes;
HOCSidebar.propTypes = {
  me: map,
  navId: string,
  counters: map,
  navSet: func,
};

const ConnectedHOCSidebar = connect(mapStateToProps, {
  navSet: a.navigation.set,
  contextMenu: a.main.contextMenu,
})(HOCSidebar);
export default ConnectedHOCSidebar;
