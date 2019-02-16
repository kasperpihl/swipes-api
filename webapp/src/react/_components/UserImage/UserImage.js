import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import userGetInitials from 'swipes-core-js/utils/user/userGetInitials';
import userGetFullName from 'swipes-core-js/utils/user/userGetFullName';

import SW from './UserImage.swiss';

@connect(state => ({
  me: state.me,
  organizations: state.organizations
}))
export default class UserImage extends PureComponent {
  static propTypes = {
    userId: PropTypes.string.isRequired,
    organizationId: PropTypes.string,
    grayscale: PropTypes.bool,
    size: PropTypes.number
  };
  getUser = () => {
    const { userId, organizationId, organizations, me } = this.props;

    if (userId === 'me' || userId === me.get('user_id')) {
      return me;
    }
    const user = organizations.getIn([organizationId, 'users', userId]);
    if (!user) {
      console.warn('UserImage expects userId and organizationId');
      return me;
    }
    return user;
  };
  render() {
    const { grayscale, size } = this.props;
    const user = this.getUser();
    if (!user) return null;

    const photo = user.get('photo');

    const fullName = userGetFullName(user);
    const initials = userGetInitials(user);

    if (photo)
      return (
        <SW.Wrapper size={size}>
          <SW.Image
            src={photo.get('192x192')}
            alt={fullName}
            grayscale={grayscale}
          />
        </SW.Wrapper>
      );
    return (
      <SW.Wrapper size={size}>
        <SW.Initials>
          <SW.Text>{initials}</SW.Text>
        </SW.Initials>
      </SW.Wrapper>
    );
  }
}
