import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import * as mainActions from 'src/redux/main/mainActions';
import withLoader from 'src/react/_hocs/withLoader';
import FormModal from 'src/react/_components/FormModal/FormModal';
import ListMenu from 'src/react/_components/ListMenu/ListMenu';
import CardHeader from 'src/react/_components/CardHeader/CardHeader';
import SW from './OrganizationHeader.swiss';
import withNav from 'src/react/_hocs/Nav/withNav';
import request from 'swipes-core-js/utils/request';

const kDelete = {
  title: 'Delete organization'
};
const kLeave = {
  title: 'Leave organization',
  subtitle: 'Transfer ownership before leaving'
};

@withNav
@withLoader
@connect(
  null,
  {
    contextMenu: mainActions.contextMenu
  }
)
export default class OrganizationHeader extends PureComponent {
  openBillingView = () => {
    const { nav, organization } = this.props;

    nav.push({
      screenId: 'Billing',
      crumbTitle: 'Billing',
      props: {
        organizationId: organization.get('organization_id')
      }
    });
  };

  openRenameModal = () => {
    const { nav, organization } = this.props;

    nav.openModal(FormModal, {
      title: 'Rename organization',
      inputs: [
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

  handleDeleteOrganization = ([password]) => {
    const { organization } = this.props;

    this.runRequest('organization.delete', {
      organization_id: organization.get('organization_id'),
      password
    });
  };

  handleLeaveOrganization = ([password]) => {
    const { organization, meInOrg } = this.props;

    this.runRequest('organization.disableUser', {
      organization_id: organization.get('organization_id'),
      target_user_id: meInOrg.get('user_id'),
      password
    });
  };

  handleRenameOrganization = ([name]) => {
    const { organization } = this.props;

    this.runRequest('organization.rename', {
      organization_id: organization.get('organization_id'),
      name
    });
  };

  openFormModal = ({ ...props }) => {
    const { nav } = this.props;

    nav.openModal(FormModal, props);
  };

  handleListClick = (i, button) => {
    const { organization } = this.props;
    if (button.title === kDelete.title) {
      const modalOptions = {
        title: 'Delete organization',
        subtitle:
          'Are you sure you want to delete this organization? Deleting it is permanent and cannot be reversed.',
        inputs: [
          {
            type: 'password',
            placeholder: 'Password',
            autoFocus: true,
            label: `Confirm deleting "${organization.get('name')}"`
          }
        ],
        onConfirm: this.handleDeleteOrganization
      };
      return this.openFormModal(modalOptions);
    }
    if (button.title === kLeave.title) {
      const modalOptions = {
        title: 'Leave organization',
        subtitle: 'Are you sure that you want to leave this organization?',
        inputs: [
          {
            type: 'password',
            placeholder: 'Password',
            autoFocus: true,
            label: `Confirm leaving "${organization.get('name')}"`
          }
        ],
        onConfirm: this.handleLeaveOrganization
      };

      return this.openFormModal(modalOptions);
    }
  };
  render() {
    const { name, loader, meInOrg } = this.props;
    const isAdmin = meInOrg.get('admin');
    return (
      <CardHeader title={name} onTitleClick={this.openRenameModal}>
        {isAdmin && (
          <SW.Button title="Billing" onClick={this.openBillingView} />
        )}
        <SW.Button
          icon="ThreeDots"
          onClick={this.openContextMenu}
          status={loader.get('ThreeDots')}
        />
      </CardHeader>
    );
  }
}
