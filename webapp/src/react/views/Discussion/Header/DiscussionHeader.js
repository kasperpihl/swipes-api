import React, { PureComponent } from 'react';
import SW from './DiscussionHeader.swiss';
import SplitImage from 'src/react/components/split-image/SplitImage';

const users = ['URU3EUPOE', 'UFXDWRVSU', 'UB9BXJ1JB'];

export default class DiscussionHeader extends PureComponent {
  render() {
    return (
      <SW.Wrapper>
        <SplitImage size={48} users={users} />
        <SW.TitleWrapper>
          <SW.Title></SW.Title>
        </SW.TitleWrapper>
      </SW.Wrapper>
    );
  }
}
