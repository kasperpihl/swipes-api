import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import * as mainActions from 'src/redux/main/mainActions';
import withLoader from 'src/react/_hocs/withLoader';
import ConfirmationModal from 'src/react/components/ConfirmationModal/ConfirmationModal';
import FormModal from 'src/react/components/FormModal/FormModal';
import ListMenu from 'src/react/context-menus/ListMenu/ListMenu';
import CardHeader from 'src/react/components/CardHeader/CardHeader';
import SW from './OrganizationHeader.swiss';
import navWrapper from 'src/react/app/view-controller/NavWrapper';
import request from 'swipes-core-js/utils/request';

const kDelete = {
  title: 'Delete organization'
};
const kLeave = {
  title: 'Leave organization',
  subtitle: 'Transfer ownership before leaving'
};

@navWrapper
@withLoader
@connect(
  null,
  {
    contextMenu: mainActions.contextMenu
  }
)
export default class OrganizationHeader extends PureComponent {
  openBillingView = () => {
    const { navPush, organization } = this.props;

    navPush({
      id: 'Billing',
      title: 'Billing',
      props: {
        organizationId: organization.get('organization_id')
      }
    });
  };

  openRenameModal = () => {
    const { openModal, organization } = this.props;

    openModal({
      component: FormModal,
      position: 'center',
      props: {
        title: 'Rename organization',
        components: [
          {
            placeholder: 'Enter name of organization',
            type: 'text',
            label: 'test',
            autoFocus: true,
            initialValue: organization.get('name')
          }
        ],
        confirmLabel: 'Rename',
        onConfirm: this.handleRenameOrganization
      }
    });
  };

  openContextMenu = e => {
    const { contextMenu, organization, meInOrg } = this.props;
    const activeUsersAmount = organization
      .get('users')
      .filter(u => u.get('status') === 'active').size;

    kLeave.disabled =
      organization.get('owner_id') === meInOrg.get('user_id') &&
      activeUsersAmount > 1;

    let buttons = [kLeave];
    if (organization.get('owner_id') === meInOrg.get('user_id')) {
      if (activeUsersAmount > 1) {
        buttons = [kLeave, kDelete];
      } else {
        buttons = [kDelete];
      }
    }

    contextMenu({
      options: {
        boundingRect: e.target.getBoundingClientRect(),
        alignX: 'right',
        excludeY: true,
        positionY: 12
      },
      component: ListMenu,
      props: {
        buttons,
        onClick: this.handleListClick
      }
    });
  };

  runRequest = (endpoint, options) => {
    const { loader } = this.props;

    loader.set('ThreeDots');
    request(endpoint, options).then(res => {
      if (res.ok) {
        loader.clear('ThreeDots');
      } else {
        loader.error('ThreeDots', res.error, 2000);
      }
    });
  };

  handleDeleteOrganization = password => {
    const { organization } = this.props;

    this.runRequest('organization.delete', {
      organization_id: organization.get('organization_id'),
      password
    });
  };

  handleLeaveOrganization = () => {
    const { organization, meInOrg } = this.props;

    this.runRequest('organization.disableUser', {
      organization_id: organization.get('organization_id'),
      target_user_id: meInOrg.get('user_id')
    });
  };

  handleRenameOrganization = ([name]) => {
    const { organization } = this.props;

    this.runRequest('organization.rename', {
      organization_id: organization.get('organization_id'),
      name
    });
  };

  openConfirmationModal = ({ ...props }) => {
    const { openModal } = this.props;

    openModal({
      component: ConfirmationModal,
      position: 'center',
      props
    });
  };

  handleListClick = (i, button) => {
    if (button.title === kDelete.title) {
      const modalOptions = {
        title: 'Delete organization',
        text:
          'Are you sure you want to delete this organization? Deleting it is permanent and cannot be reversed.',
        callback: this.handleDeleteOrganization
      };
      return this.openConfirmationModal(modalOptions);
    }
    if (button.title === kLeave.title) {
      const modalOptions = {
        title: 'Leave organization',
        text: 'Are you sure that you want to leave this organization?',
        callback: this.handleLeaveOrganization,
        checkPassword: true
      };

      return this.openConfirmationModal(modalOptions);
    }
  };
  render() {
    const { name, loader } = this.props;
    return (
      <CardHeader title={name} onTitleClick={this.openRenameModal}>
        <SW.Button title="Billing" onClick={this.openBillingView} rounded />
        <SW.Button
          icon="ThreeDots"
          onClick={this.openContextMenu}
          rounded
          {...loader.get('ThreeDots')}
        />
      </CardHeader>
    );
  }
}
