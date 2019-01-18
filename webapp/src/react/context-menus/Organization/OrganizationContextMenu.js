import React, { PureComponent } from 'react';
import ProfileOrgDelete from 'src/react/views/Profile/Org/Delete/ProfileOrgDelete.js';
import SW from './OrganizationContextMenu.swiss';

export default class OrganizationContextMenu extends PureComponent {
  openDeleteOrganizationModal = () => {
    const { openModal } = this.props;

    openModal({
      component: ProfileOrgDelete,
      position: 'center',
      props: {
        orgId: this.props.orgId
      }
    });
  };
  render() {
    return (
      <SW.Wrapper>
        <SW.ItemRow onClick={this.openDeleteOrganizationModal}>
          Delete organization
        </SW.ItemRow>
      </SW.Wrapper>
    );
  }
}
