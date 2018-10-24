import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import HOCAssigning from 'components/assigning/HOCAssigning';
import { setupCachedCallback } from 'react-delegate';
import * as mainActions from 'src/redux/main/mainActions';
import * as navigationActions from 'src/redux/navigation/navigationActions';
import SW from './Sidebar.swiss';
import { SwissProvider } from 'swiss-react';

@connect(
  state => ({
    me: state.me,
    navId: state.navigation.getIn(['primary', 'id']),
    counter: state.counter,
  }),
  {
    navSet: navigationActions.set,
    contextMenu: mainActions.contextMenu,
  }
)
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
    if (e.button === 1) {
      this.onClick(id, 'secondary', e);
    }
  }
  onClick(id, target, e) {
    const { navSet } = this.props;

    if (e.which === 2 || e.which === 4) {
      target = 'secondary';
    }

    navSet(target, {
      id,
      title: this.getTitleForId(id),
    });
  }
  getNavItems() {
    return [
      { id: 'ProjectOverview', svg: 'Milestones' },
      { id: 'PlanCreate', svg: 'Goals' },
      { id: 'Discuss', svg: 'Messages' },
    ].filter(v => !!v);
  }
  getTitleForId(id) {
    switch (id) {
      case 'ProjectOverview':
        return 'Organize';
      case 'PlanCreate':
        return 'Plan';
      case 'PostFeed':
        return 'Discuss';
      case 'PlanList':
        return 'Plan';
      case 'TakeAction':
        return 'Take Action';
      case 'AccountList':
        return 'Account';
      default:
        return id;
    }
  }

  renderItem(item) {
    const { navId, counter } = this.props;

    let count = 0;
    if (item.id === 'Discuss') {
      count = (counter && counter.get('discussion').size) || 0;
    }
    if (count > 9) {
      count = '9+';
    }

    const active = item.id === navId;

    return (
      <SwissProvider active={active} key={item.id}>
        <SW.Item
          onClick={this.onClickCached(item.id, 'primary')}
          onContextMenu={this.onRightClickCached(item.id, 'secondary')}
          onMouseDown={this.onMouseDownCached(item.id)}
          key={item.id}
          data-id={item.id}
          className="item"
        >
          <SW.Description className="description">
            {this.getTitleForId(item.id)}
          </SW.Description>
          {item.id === 'AccountList' ? (
            <HOCAssigning assignees={[item.personId]} size={30} />
          ) : (
            <SW.Icon icon={item.svg} className="icon" />
          )}
          {count ? (
            <SW.NotificationCounter>{count}</SW.NotificationCounter>
          ) : null}
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
        <SW.TopSection />
        <SW.MiddleSection>
          <SW.Section>{this.renderMiddleSection()}</SW.Section>
        </SW.MiddleSection>
        <SW.BottomSection>
          {this.renderItem({ id: 'Search', svg: 'Search' })}
          {this.renderProfile()}
        </SW.BottomSection>
      </SW.Wrapper>
    );
  }
}
