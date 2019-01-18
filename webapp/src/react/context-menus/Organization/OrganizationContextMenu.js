import React, { PureComponent } from 'react';
import OrganizationDelete from 'src/react/views/Organization/Delete/OrganizationDelete.js';
import SW from './OrganizationContextMenu.swiss';

export default class OrganizationContextMenu extends PureComponent {
  openDeleteOrganizationModal = () => {
    const { openModal } = this.props;

    openModal({
      component: OrganizationDelete,
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
