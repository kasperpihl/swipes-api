import React, { PureComponent, Fragment } from 'react';
import { styleElement } from 'swiss-react';
import SW from './DiscussOverview.swiss';
import { setupCachedCallback } from 'react-delegate';

import PingList from '../components/Ping/List/PingList';

import SWView from 'SWView';

const sections = [
  {
    title: 'Pings',
    items: [
      'Received',
      'Sent',
    ]
  },
  {
    title: 'Discussions',
    items: [
      'Following',
      'All other',
      'Created by me',
    ]
  }
];

export default class extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      activeIndex: '0-0',
    };
    this.onClickCached = setupCachedCallback(this.onClick);
  }
  onClick = (index) => {
    if(index !== this.state.activeIndex) {
      this.setState({
        activeIndex: index,
      });
    }
  }
  renderSidebar() {
    const { activeIndex } = this.state;
    return sections.map(({ title, items }, i) => (
      <Fragment key={i}>
        <SW.Section>{title}</SW.Section>
        {items.map((item, j) => (
          <SW.Item
            key={j}
            unread={j === 0}
            onClick={this.onClickCached(`${i}-${j}`)}
            active={activeIndex === `${i}-${j}`}>
            {item}
            <SW.Notification>{j === 0 ? '1' : undefined}</SW.Notification>
          </SW.Item>
        ))}
      </Fragment>
    ))
  }
  renderContent() {
    return (
      <SW.ContentWrapper>
        <PingList />
      </SW.ContentWrapper>
    )
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