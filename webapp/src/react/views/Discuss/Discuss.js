import React, { PureComponent, Fragment } from 'react';
import SW from './Discuss.swiss';
import { setupCachedCallback } from 'react-delegate';
import PingList from 'src/react/views/Ping/List/HOCPingList';
import DiscussionList from 'src/react/views/Discussion/List/DiscussionList';

import SWView from 'SWView';

const sections = [
  {
    title: 'Pings',
    items: [
      'Received',
      'Sent',
    ],
  },
  {
    title: 'Discussions',
    items: [
      'Following',
      'All other',
      'By me',
    ],
  },
];

export default class Discuss extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      activeType: 0,
      activeItem: 0,
    };
    this.onClickCached = setupCachedCallback(this.onClick);
  }
  onClick = (uS, typeI, itemI) => {
    if(
      itemI !== this.state.activeItem ||
      typeI !== this.state.activeType
    ) {
      this.setState({
        activeType: typeI,
        activeItem: itemI
      });
    }
  }
  renderSidebar() {
    const { activeType, activeItem } = this.state;
    return sections.map(({ title, items }, typeI) => (
      <Fragment key={typeI}>
        <SW.Section>{title}</SW.Section>
        {items.map((item, itemI) => (
          <SW.Item
            key={itemI}
            onClick={this.onClickCached(`${typeI}-${itemI}`, typeI, itemI)}
            active={activeType === typeI && activeItem === itemI}>
            {item}
            <SW.Notification>{itemI === 0 ? '1' : undefined}</SW.Notification>
          </SW.Item>
        ))}
      </Fragment>
    ))
  }
  renderContent() {
    const { activeType, activeItem } = this.state;
    if(activeType === 0) {
      return <PingList activeItem={activeItem} />
    }
    return <DiscussionList activeItem={activeItem} />
  }
  render() {
    return (
      <SW.Wrapper>
        <SW.SidebarWrapper>
          {this.renderSidebar()}
        </SW.SidebarWrapper>
        {this.renderContent()}
      </SW.Wrapper>
    );
  }
}
