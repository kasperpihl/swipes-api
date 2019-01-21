import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { setupCachedCallback } from 'react-delegate';
import * as mainActions from 'src/redux/main/mainActions';
import * as navigationActions from 'src/redux/navigation/navigationActions';
import SW from './Sidebar.swiss';
import UserImage from 'src/react/_components/UserImage/UserImage';

const kNavItems = [
  { id: 'Organize', svg: 'Milestones' },
  { id: 'Discuss', svg: 'Messages' }
];

@connect(
  state => ({
    me: state.me,
    auth: state.auth,
    navId: state.navigation.getIn(['primary', 'id']),
    counter: state.counter
  }),
  {
    navSet: navigationActions.set,
    contextMenu: mainActions.contextMenu
  }
)
export default class Sidebar extends PureComponent {
  constructor(props) {
    super(props);
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
      title: id
    });
  }

  renderItem(item) {
    const { navId, counter, auth } = this.props;

    let count = 0;
    if (item.id === 'Discuss') {
      count = (counter && counter.get('discussion').size) || 0;
    }
    if (count > 9) {
      count = '9+';
    }

    const active = item.id === navId;

    return (
      <SW.ProvideContext active={active} key={item.id}>
        <SW.Item
          round={item.id === 'Profile'}
          onClick={this.onClickCached(item.id, 'primary')}
          onContextMenu={this.onRightClickCached(item.id, 'secondary')}
          onMouseDown={this.onMouseDownCached(item.id)}
          key={item.id}
          data-id={item.id}
          className="item"
        >
          <SW.Description className="description">{item.id}</SW.Description>
          {item.id === 'Profile' && auth.get('token') ? (
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
          {this.renderItem({ id: 'Profile' })}
        </SW.BottomSection>
      </SW.Wrapper>
    );
  }
}
