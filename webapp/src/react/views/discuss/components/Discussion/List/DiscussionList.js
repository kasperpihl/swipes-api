import React, { PureComponent } from 'react';
import DiscussionComposer from '../Composer/DiscussionComposer';
import DiscussionListItem from './Item/DiscussionListItem';
import SW from './DiscussionList.swiss';

const items = [];

export default class extends PureComponent {
  renderItems() {
    return items.map((item, i) => (
      <DiscussionListItem item={item} key={i}/>
    ));
  }
  render() {
    return (
      <SW.Wrapper>
        <DiscussionComposer />
        <SW.Title>Discussions you follow</SW.Title>
        {this.renderItems()}
      </SW.Wrapper>
    );
  }
}
