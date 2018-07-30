import React, { PureComponent, Fragment } from 'react';
import SW from './Discuss.swiss';
import { connect } from 'react-redux';
import { setupCachedCallback } from 'react-delegate';
// import HOCPingList from 'src/react/views/Ping/List/HOCPingList';
import DiscussionList from 'src/react/views/Discussion/List/DiscussionList';

import SWView from 'SWView';

const sections = [
  // {
  //   title: 'Pings',
  //   items: [
  //     'Received',
  //     'Sent',
  //   ],
  // },
  {
    title: 'Discussions',
    items: [
      'Following',
      'All other',
      'By me',
    ],
  },
];

@connect(state => ({
  discussionCounter: state.counter.get('discussion'),
}))
export default class Discuss extends PureComponent {
  static sizes() {
    return [654];
  }
  constructor(props) {
    super(props);
    this.state = {
      activeType: props.initialType || 0,
      activeItem: props.initialItem || 0,
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
  setActiveType = (i) => {
    this.setState({
      activeType: i
    });
  }
  setActiveItem = (i) => {
    this.setState({
      activeItem: i
    });
  }
  renderSidebar() {
    const { discussionCounter } = this.props;
    let count = discussionCounter.size;
    if(count > 9) count = '9+';
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
            <SW.Notification>
              {itemI === 0 ? count : undefined}
            </SW.Notification>
          </SW.Item>
        ))}
      </Fragment>
    ))
  }
  renderContent() {
    const { activeType, activeItem } = this.state;
    // const Comp = activeType === 0 ? HOCPingList : DiscussionList;
    const Comp = DiscussionList;
    return (
      <Comp
        activeItem={activeItem}
        setActiveType={this.setActiveType}
        setActiveItem={this.setActiveItem}
      />
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
