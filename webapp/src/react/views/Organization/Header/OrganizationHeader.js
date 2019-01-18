import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import * as mainActions from 'src/redux/main/mainActions';
import OrganizationContextMenu from 'src/react/context-menus/Organization/OrganizationContextMenu.js';
import CardHeader from 'src/react/components/CardHeader/CardHeader';
import SW from './OrganizationHeader.swiss';

import navWrapper from 'src/react/app/view-controller/NavWrapper';

@navWrapper
@connect(
  null,
  {
    contextMenu: mainActions.contextMenu
  }
)
export default class OrganizationHeader extends PureComponent {
  getOptionsForE = e => {
    return {
      boundingRect: e.target.getBoundingClientRect(),
      alignX: 'right',
      excludeY: true,
      positionY: 12
    };
  };

  openContextMenu = e => {
    const { contextMenu, openModal, orgId } = this.props;
    const options = this.getOptionsForE(e);

    contextMenu({
      options,
      component: OrganizationContextMenu,
      props: {
        openModal,
        orgId
      }
    });
  };

  renderSubscriptionStatus = () => {
    const { activeSubscription, trialExpired } = this.props;
    if (activeSubscription !== null || !trialExpired) {
      return 'Active';
    } else if (!activeSubscription && trialExpired) {
      return 'Inactive';
    }
  };
  render() {
    const { name, trialExpired } = this.props;
    return (
      <CardHeader title={name}>
        <SW.Button icon="ThreeDots" onClick={this.openContextMenu} rounded />
      </CardHeader>
    );
  }
}
