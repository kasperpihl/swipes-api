import React, { PureComponent } from 'react';
import UserImage from 'src/react/components/UserImage/UserImage';
import SW from './OrganizationUser.swiss';

export default class OrganizationUser extends PureComponent {
  render() {
    const { user } = this.props;
    return (
      <SW.Wrapper>
        <UserImage userId={user.get('user_id')} size={36} />
        <SW.Name>
          {user.get('first_name')} {user.get('last_name')}
        </SW.Name>
        <SW.Email>{user.get('email')}</SW.Email>
        <SW.UserType>{user.get('admin') ? 'Admin' : 'User'}</SW.UserType>
      </SW.Wrapper>
    );
  }
}
