import React, { PureComponent } from 'react';
import UserImage from 'src/react/_components/UserImage/UserImage';
import userGetFullName from 'core/utils/user/userGetFullName';

import SW from './TooltipUsers.swiss';

export default class TooltipUsers extends PureComponent {
  render() {
    const { userIds, teamId } = this.props;
    if (!userIds) return null;
    return (
      <SW.Wrapper>
        {userIds.map(uId => (
          <SW.UserWrapper key={uId}>
            <SW.ImageWrapper>
              <UserImage userId={uId} teamId={teamId} />
            </SW.ImageWrapper>
            <SW.Name>{userGetFullName(uId, teamId)}</SW.Name>
          </SW.UserWrapper>
        ))}
      </SW.Wrapper>
    );
  }
}
