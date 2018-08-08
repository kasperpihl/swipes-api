import React, { PureComponent } from 'react';
import SplitImage from 'components/SplitImage/SplitImage';
import SW from './DiscussionHeader.swiss';

export default class DiscussionHeader extends PureComponent {
  render() {
    const { followers } = this.props;

    return (
      <SW.Wrapper>
        <SW.LeftSide />
        <SplitImage followers={followers} size={40} />
        <SW.RightSide />
      </SW.Wrapper>
    );
  }
}
