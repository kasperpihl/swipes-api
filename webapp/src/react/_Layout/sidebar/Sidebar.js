import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import cachedCallback from 'src/utils/cachedCallback';
import * as navigationActions from 'src/redux/navigation/navigationActions';
import SW from './Sidebar.swiss';
import UserImage from 'src/react/_components/UserImage/UserImage';

const kNavItems = [
  { screenId: 'Projects', svg: 'Milestones' },
  { screenId: 'Chat', svg: 'Messages' }
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
  handleMouseDownCached = cachedCallback((screenId, e) => {
    if (e.button === 1) {
      this.openScreen('right', screenId);
    }
  });
  handleContextMenuCached = cachedCallback((screenId, e) => {
    e.preventDefault();
    this.openScreen('right', screenId);
  });
  handleClickCached = cachedCallback(screenId =>
    this.openScreen('left', screenId)
  );
  openScreen(side, screenId) {
    const { navSet } = this.props;
    navSet(side, {
      screenId,
      crumbTitle: screenId
    });
  }

  renderItem(item) {
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
          onClick={this.handleClickCached(item.screenId)}
          onContextMenu={this.handleContextMenuCached(item.screenId)}
          onMouseDown={this.handleMouseDownCached(item.screenId)}
          className="item"
        >
          <SW.Description className="description">
            {item.screenId}
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
            {kNavItems.map((o, i) => this.renderItem(o, i))}
          </SW.Section>
        </SW.MiddleSection>
        <SW.BottomSection>
          {this.renderItem({ screenId: 'Profile' })}
        </SW.BottomSection>
      </SW.Wrapper>
    );
  }
}
