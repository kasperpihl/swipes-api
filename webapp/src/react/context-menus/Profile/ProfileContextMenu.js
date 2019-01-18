import React, { PureComponent } from 'react';
import ProfileOrgDelete from 'src/react/views/Profile/Org/Delete/ProfileOrgDelete.js';
import request from 'swipes-core-js/utils/request';
import SW from './ProfileContextMenu.swiss';

export default class ProfileContextMenu extends PureComponent {
  openDeleteOrganizationModal = () => {
    const { openModal } = this.props;

    openModal({
      component: ProfileOrgDelete,
      position: 'center'
    });
  };

  handleLogOut = () => {
    request('user.signout');
  };

  render() {
    return (
      <SW.Wrapper>
        <SW.ItemRow onClick={this.openDeleteOrganizationModal}>
          Delete organization
        </SW.ItemRow>
        <SW.ItemRow onClick={this.handleLogOut}>Log out</SW.ItemRow>
      </SW.Wrapper>
    );
  }
}
