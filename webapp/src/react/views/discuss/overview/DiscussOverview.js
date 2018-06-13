import React, { PureComponent, Fragment } from 'react';
import { styleElement } from 'swiss-react';
import styles from './DiscussOverview.swiss';
import { setupCachedCallback } from 'react-delegate';

import PingList from '../components/Ping/List/PingList';

import SWView from 'SWView';

const Wrapper = styleElement('div', styles.Wrapper);
const SidebarWrapper = styleElement('div', styles.SidebarWrapper);
const ContentWrapper = styleElement('div', styles.ContentWrapper);
const Section = styleElement('div', styles.Section);
const Item = styleElement('div', styles.Item);
const Notification = styleElement('div', styles.Notification);

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
        <Section>{title}</Section>
        {items.map((item, j) => (
          <Item
            key={j}
            unread={j === 0}
            onClick={this.onClickCached(`${i}-${j}`)}
            active={activeIndex === `${i}-${j}`}>
            {item}
            <Notification>{j === 0 ? '1' : undefined}</Notification>
          </Item>
        ))}
      </Fragment>
    ))
  }
  renderContent() {
    return (
      <ContentWrapper>
        <PingList />
      </ContentWrapper>
    )
  }
  render() {
    return (
      <Wrapper>
        <SidebarWrapper>
          {this.renderSidebar()}
        </SidebarWrapper>
        {this.renderContent()}
      </Wrapper>
    );
  }
}