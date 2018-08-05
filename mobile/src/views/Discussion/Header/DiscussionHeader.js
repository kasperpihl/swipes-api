import React, { PureComponent } from 'react';
import SW from './DiscussionHeader.swiss';

export default class DiscussionHeader extends PureComponent {
  renderProfilePic() {
    const { discussion } = this.props;
    const image = msgGen.users.getPhoto(discussion.get('created_by'));
    const initials = msgGen.users.getInitials(discussion.get('created_by'));

    if (!image) {
      return null;
    }

    return (
      <SW.LeftSide>
        <SW.ProfilePic source={{ uri: image }} />
      </SW.LeftSide>
    );
  }
  render() {

    return (
      <SW.Wrapper>
        <SW.LeftSide>
          {this.renderProfilePic()}
        </SW.LeftSide>
        <SW.RightSide>
        </SW.RightSide>
      </SW.Wrapper>
    );
  }
}
