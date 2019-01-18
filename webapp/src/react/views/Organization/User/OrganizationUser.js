import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import * as mainActions from 'src/redux/main/mainActions';
import Button from 'src/react/components/Button/Button';
import UserImage from 'src/react/components/UserImage/UserImage';
import UserOptionsContextMenu from 'src/react/context-menus/UserOptions/UserOptionsContextMenu';
import navWrapper from 'src/react/app/view-controller/NavWrapper';
import SW from './OrganizationUser.swiss';

@navWrapper
@connect(
  (state, props) => ({
    organization: state.organization.get(props.organizationId)
  }),
  {
    contextMenu: mainActions.contextMenu
  }
)
export default class OrganizationUser extends PureComponent {
  getOptionsForE = e => {
    return {
      boundingRect: e.target.getBoundingClientRect(),
      alignX: 'right',
      excludeY: true,
      positionY: 12
    };
  };

  handleClick = e => {
    const { contextMenu, openModal, organization, user, me } = this.props;
    const options = this.getOptionsForE(e);
    const isOwner = organization.get('owner_id') === me.get('user_id');

    contextMenu({
      options,
      component: UserOptionsContextMenu,
      props: {
        openModal,
        organization,
        user,
        isOwner,
        me
      }
    });
  };

  render() {
    const { user, organization, me } = this.props;
    console.log('Org:', organization.toJS(), 'user:', user.toJS());
    return (
      <SW.Wrapper>
        <UserImage
          userId={user.get('user_id')}
          organizationId={organization.get('organization_id')}
          size={36}
        />
        <SW.UserDetails>
          <SW.Name>
            {user.get('first_name')} {user.get('last_name')}
          </SW.Name>
          <SW.Email>{user.get('email')}</SW.Email>
        </SW.UserDetails>
        <SW.UserType>
          {organization.get('owner_id') === user.get('user_id')
            ? 'Owner'
            : 'User'}
        </SW.UserType>
        <Button icon="ThreeDots" onClick={this.handleClick} rounded />
      </SW.Wrapper>
    );
  }
}
