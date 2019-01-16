import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import request from 'swipes-core-js/utils/request';
import SW from './UserImage.swiss';

@connect(state => ({
  me: state.me,
  organization: state.organization
}))
export default class UserImage extends PureComponent {
  static propTypes = {
    userId: PropTypes.string.isRequired,
    organizationId: PropTypes.string,
    blackAndWhite: PropTypes.bool,
    size: PropTypes.number
  };
  getUser = () => {
    const { userId, organizationId, organization, me } = this.props;

    if (userId === 'me' || userId === me.get('user_id')) {
      return me;
    }
    const user = organization.getIn([organizationId, 'users', userId]);
    if (!user) {
      console.warn('UserImage expects userId and organizationId');
      return me;
    }
    return user;
  };
  render() {
    const { blackAndWhite, size } = this.props;
    const user = this.getUser();
    const photo = user.get('photo');
    const fullName = `${user.get('first_name')} ${user.get('last_name')}`;
    const initials = `${user.get('first_name').charAt(0)}${user
      .get('last_name')
      .charAt(0)}`;

    if (photo)
      return (
        <SW.Wrapper>
          <SW.Image
            src={photo.get('192x192')}
            alt={fullName}
            blackAndWhite={blackAndWhite}
          />
        </SW.Wrapper>
      );
    return (
      <SW.Wrapper>
        <SW.Initials>
          <SW.Text>{initials}</SW.Text>
        </SW.Initials>
      </SW.Wrapper>
    );
  }
}
