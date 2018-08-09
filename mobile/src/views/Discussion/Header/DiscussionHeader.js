import React, { PureComponent } from 'react';
import SplitImage from 'components/SplitImage/SplitImage';
import SW from './DiscussionHeader.swiss';

export default class DiscussionHeader extends PureComponent {
  render() {
    const { followers, topic } = this.props;
    const followersLabel = followers.length > 1 ? 'followers' : 'follower';

    return (
      <SW.Wrapper>
        <SW.LeftSide>
          <SplitImage followers={followers} size={40} />
        </SW.LeftSide>
        <SW.RightSide>
          <SW.LineOfText numberOfLines={1} topic>
            {topic}
          </SW.LineOfText>
          <SW.LineOfText numberOfLines={1}>
            {followers.length} {followersLabel}
          </SW.LineOfText>
        </SW.RightSide>
      </SW.Wrapper>
    );
  }
}
