import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import cachedCallback from 'src/utils/cachedCallback';
import * as navigationActions from 'src/redux/navigation/navigationActions';
import SW from './Sidebar.swiss';
import UserImage from 'src/react/_components/UserImage/UserImage';

const kNavItems = [
  { screenId: 'ProjectList', svg: 'Project', title: 'Projects' },
  { screenId: 'Planning', svg: 'Plan' },
  { screenId: 'Chat', svg: 'Chat' },
  { screenId: 'Profile' }
];

@connect(
  state => {
    let unreadCounter = 0;
    state.connection
      .get('unreadByTeam')
      .forEach(team => (unreadCounter += team.size));

    return {
      sidebarExpanded: state.main.get('sidebarExpanded'),
      sideMenuId: state.navigation.get('sideMenuId'),
      unreadCounter
    };
  },
  {
    navSet: navigationActions.set
  }
)
export default class Sidebar extends PureComponent {
  handleMouseDownCached = cachedCallback((i, e) => {
    if (e.button === 1) {
      this.openScreen('right', kNavItems[i]);
    }
  });
  handleContextMenuCached = cachedCallback((i, e) => {
    e.preventDefault();
    this.openScreen('right', kNavItems[i]);
  });
  handleClickCached = cachedCallback(i =>
    this.openScreen('left', kNavItems[i])
  );
  openScreen(side, { screenId, title }) {
    const { navSet } = this.props;
    navSet(side, {
      screenId,
      crumbTitle: title || screenId
    });
  }
  renderNotificationCounter(item) {
    let { unreadCounter } = this.props;
    if (item.screenId !== 'Chat' || !unreadCounter) {
      return null;
    }

    let count = unreadCounter;
    if (count > 9) {
      count = '9+';
    }

    return <SW.NotificationCounter>{count}</SW.NotificationCounter>;
  }
  renderItem(i) {
    const item = kNavItems[i];
    const { sideMenuId } = this.props;

    const active = item.screenId === sideMenuId;

    return (
      <SW.ProvideContext active={active} key={item.screenId}>
        <SW.Item
          round={item.screenId === 'Profile'}
          onClick={this.handleClickCached(i)}
          onContextMenu={this.handleContextMenuCached(i)}
          onMouseDown={this.handleMouseDownCached(i)}
          className="item"
        >
          <SW.OverflowHidden>
            {item.screenId === 'Profile' && <UserImage userId="me" />}
            {item.screenId !== 'Profile' && (
              <>
                <SW.IconWrapper>
                  <SW.Icon icon={item.svg} />
                </SW.IconWrapper>
                <SW.Description>{item.title || item.screenId}</SW.Description>
              </>
            )}
            {this.renderNotificationCounter(item)}
          </SW.OverflowHidden>

          <SW.Tooltip forceShow={item.screenId === 'Profile'}>
            {item.title || item.screenId}
          </SW.Tooltip>
        </SW.Item>
      </SW.ProvideContext>
    );
  }
  render() {
    const { sidebarExpanded } = this.props;

    return (
      <SW.ProvideContext expanded={sidebarExpanded}>
        <SW.Wrapper>
          {typeof sidebarExpanded !== 'undefined' && (
            <>
              <SW.TopSection />
              <SW.MiddleSection>
                <SW.Section>
                  {this.renderItem(0)}
                  {this.renderItem(1)}
                  {this.renderItem(2)}
                </SW.Section>
              </SW.MiddleSection>
              <SW.BottomSection>{this.renderItem(3)}</SW.BottomSection>
            </>
          )}
        </SW.Wrapper>
      </SW.ProvideContext>
    );
  }
}
