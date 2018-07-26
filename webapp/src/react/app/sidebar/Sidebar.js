import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import HOCAssigning from 'components/assigning/HOCAssigning';
import { setupCachedCallback } from 'react-delegate';
import HOCNotificationList from 'src/react/views/Notification/List/HOCNotificationList';
import * as mainActions from 'src/redux/main/mainActions';
import * as navigationActions from 'src/redux/navigation/navigationActions';
import SW from './Sidebar.swiss';
import { SwissProvider } from 'swiss-react';

@connect(state => ({
  me: state.me,
  navId: state.navigation.getIn(['primary', 'id']),
  notificationCounter: state.connection.get('notificationCounter'),
}), {
  navSet: navigationActions.set,
  contextMenu: mainActions.contextMenu,
})

export default class Sidebar extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isOpenNotifications: false,
    };
    this.onClickCached = setupCachedCallback(this.onClick, this);
    this.onRightClickCached = setupCachedCallback(this.onClick, this);
    this.onMouseDownCached = setupCachedCallback(this.onMouseDown, this);
  }
  onMouseDown(id, e) {
    if(e.button === 1) {
      this.onClick(id, 'secondary', e);
    }
  }
  onClick(id, target, e) {
    const { navSet } = this.props;

    if(e.which === 2 || e.which === 4) {
      target = 'secondary';
    }
    if (id === 'NotificationList') {
      this.openNotifications(e);
      return;
    }

    navSet(target, {
      id,
      title: this.getTitleForId(id),
      showTitleInCrumb: id === 'Discuss',
    });
  }
  getNavItems() {
    return [
      { id: 'PlanList', svg: 'Milestones' },
      { id: 'TakeAction', svg: 'Goals' },
      { id: 'Discuss', svg: 'Messages' },
    ].filter(v => !!v);
  }
  getTitleForId(id) {
    switch (id) {
      case 'PostFeed':
        return 'Discuss';
      case 'PlanList':
        return 'Plan';
      case 'TakeAction':
        return 'Take Action';
      case 'AccountList':
        return 'Account';
      case 'NotificationList':
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
      component: HOCNotificationList,
      onClose: () => { this.setState({ isOpenNotifications: false }); },
      options,
    })
  }
  renderItem(item) {
    const { navId, notificationCounter } = this.props;
    const { isOpenNotifications: isOpen } = this.state;

    let counter = 0;
    if (item.id === 'Onboarding') {
      counter = this.getRemainingOnboarding();
    } else if (item.id === 'Notifications') {
      counter = notificationCounter;
    }

    let active = null;
    if (isOpen && item.id === 'Notifications' || !isOpen && item.id === navId) {
      active = true;
    }

    return (
      <SwissProvider active={active} key={item.id}>
        <SW.Item
          onClick={this.onClickCached(item.id, 'primary')}
          onContextMenu={this.onRightClickCached(item.id, 'secondary')}
          onMouseDown={this.onMouseDownCached(item.id)}
          key={item.id}
          data-id={item.id}
          className='item'
        >
        <SW.Description className='description'>{this.getTitleForId(item.id)}</SW.Description>
          {item.id === 'AccountList' ? <HOCAssigning assignees={[item.personId]} size={30} /> : <SW.Icon icon={item.svg} className='icon'/>}
          {counter ? <SW.NotificationCounter>{counter}</SW.NotificationCounter> : null}
        </SW.Item>
      </SwissProvider>
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
      <SW.Wrapper>
        <SW.TopSection>
          {this.renderItem({ id: 'NotificationList', svg: 'Notification' })}
          {this.getRemainingOnboarding() ? this.renderItem({ id: 'Onboarding', svg: 'Onboarding' }) : null}
        </SW.TopSection>
        <SW.MiddleSection>
          <SW.Section>
            {this.renderMiddleSection()}
          </SW.Section>
        </SW.MiddleSection>
        <SW.BottomSection>
          {this.renderItem({ id: 'Search', svg: 'Search' })}
          {this.renderProfile()}
        </SW.BottomSection>
      </SW.Wrapper>
    );
  }
}
