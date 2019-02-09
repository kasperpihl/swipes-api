import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import cachedCallback from 'src/utils/cachedCallback';
import * as navigationActions from 'src/redux/navigation/navigationActions';
import SW from './Sidebar.swiss';
import UserImage from 'src/react/_components/UserImage/UserImage';

const kNavItems = [
  { screenId: 'ProjectList', svg: 'Milestones', title: 'Projects' },
  { screenId: 'Chat', svg: 'Messages' },
  { screenId: 'Profile' }
];

@connect(
  state => ({
    auth: state.auth,
    sideMenuId: state.navigation.get('sideMenuId'),
    unreadCounter: state.connection.get('unread').size
  }),
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

  renderItem(i) {
    const item = kNavItems[i];
    const { sideMenuId, unreadCounter, auth } = this.props;

    let count = item.screenId === 'Chat' ? unreadCounter : 0;
    if (count > 9) {
      count = '9+';
    }

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
          <SW.Description className="description">
            {item.title || item.screenId}
          </SW.Description>
          {item.screenId === 'Profile' && auth.get('token') ? (
            <UserImage userId="me" />
          ) : (
            <SW.Icon icon={item.svg} className="icon" />
          )}
          {count ? (
            <SW.NotificationCounter>{count}</SW.NotificationCounter>
          ) : null}
        </SW.Item>
      </SW.ProvideContext>
    );
  }
  render() {
    return (
      <SW.Wrapper>
        <SW.TopSection />
        <SW.MiddleSection>
          <SW.Section>
            {this.renderItem(0)}
            {this.renderItem(1)}
          </SW.Section>
        </SW.MiddleSection>
        <SW.BottomSection>{this.renderItem(2)}</SW.BottomSection>
      </SW.Wrapper>
    );
  }
}
