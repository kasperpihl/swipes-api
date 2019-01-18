import React, { PureComponent } from 'react';
import UserOptionsModal from 'src/react/views/Organization/User/UserOptionsModal.js';
import SW from './UserOptionsContextMenu.swiss';

import request from 'swipes-core-js/utils/request';

export default class UserOptionsContextMenu extends PureComponent {
  openActionModal = (title, cb) => {
    const { openModal, organization } = this.props;
    openModal({
      component: UserOptionsModal,
      position: 'center',
      props: {
        title,
        organization,
        userAction: cb
      }
    });
  };

  handlePromoteAdmin = () => {
    const { organization, user } = this.props;

    request('organization.promoteAdmin', {
      organization_id: organization.get('organization_id'),
      target_user_id: user.get('user_id')
    });
  };

  handleDemoteAdmin = () => {
    const { organization, user } = this.props;

    request('organization.demoteAdmin', {
      organization_id: organization.get('organization_id'),
      target_user_id: user.get('user_id')
    });
  };

  render() {
    const { isOwner } = this.props;

    return (
      <SW.Wrapper>
        {isOwner ? (
          <SW.ItemRow
            onClick={() =>
              this.openActionModal(
                'Promote user to admin',
                this.handlePromoteAdmin
              )
            }
          >
            Promote to admin
          </SW.ItemRow>
        ) : null}
        <SW.ItemRow
          onClick={() =>
            this.openActionModal('Demote admin to user', this.handleDemoteAdmin)
          }
        >
          Demote admin to user
        </SW.ItemRow>
        <SW.ItemRow>Transfer ownership</SW.ItemRow>
        <SW.ItemRow>Enable account</SW.ItemRow>
        <SW.ItemRow>Disable account</SW.ItemRow>
      </SW.Wrapper>
    );
  }
}
