import React, { PureComponent } from 'react';
import UserImage from 'src/react/_components/UserImage/UserImage';
import userGetFullName from 'core/utils/user/userGetFullName';

import SW from './TooltipUsers.swiss';

export default class TooltipUsers extends PureComponent {
  render() {
    const { userIds, organizationId } = this.props;
    if (!userIds) return null;
    return (
      <SW.Wrapper>
        {userIds.map(uId => (
          <SW.UserWrapper key={uId}>
            <SW.ImageWrapper>
              <UserImage userId={uId} organizationId={organizationId} />
            </SW.ImageWrapper>
            <SW.Name>{userGetFullName(uId, organizationId)}</SW.Name>
          </SW.UserWrapper>
        ))}
      </SW.Wrapper>
    );
  }
}
