import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import * as mainActions from 'src/redux/main/mainActions';
import withLoader from 'src/react/_hocs/withLoader';
import FormModal from 'src/react/_components/FormModal/FormModal';
import ListMenu from 'src/react/_components/ListMenu/ListMenu';
import CardHeader from 'src/react/_components/Card/Header/CardHeader';
import SW from './TeamHeader.swiss';
import withNav from 'src/react/_hocs/Nav/withNav';
import request from 'core/utils/request';

const kDelete = {
  title: 'Delete team'
};
const kLeave = {
  title: 'Leave team',
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
export default class TeamHeader extends PureComponent {
 

  openRenameModal = () => {
    const { nav, team } = this.props;

    nav.openModal(FormModal, {
      title: 'Rename team',
      inputs: [
        {
          placeholder: 'Enter name of team',
          type: 'text',
          label: '',
          autoFocus: true,
          initialValue: team.get('name')
        }
      ],
      confirmLabel: 'Rename',
      onConfirm: this.handleRenameTeam
    });
  };

  openContextMenu = e => {
    const { contextMenu, team, meInTeam } = this.props;
    const activeUsersAmount = team
      .get('users')
      .filter(u => u.get('status') === 'active').size;

    kLeave.disabled =
      team.get('owner_id') === meInTeam.get('user_id') && activeUsersAmount > 1;

    let buttons = [kLeave];
    if (team.get('owner_id') === meInTeam.get('user_id')) {
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

  handleDeleteTeam = ([password]) => {
    const { team } = this.props;

    this.runRequest('team.delete', {
      team_id: team.get('team_id'),
      password
    });
  };

  handleLeaveTeam = ([password]) => {
    const { team, meInTeam } = this.props;

    this.runRequest('team.disableUser', {
      team_id: team.get('team_id'),
      target_user_id: meInTeam.get('user_id'),
      password
    });
  };

  handleRenameTeam = ([name]) => {
    const { team } = this.props;

    this.runRequest('team.rename', {
      team_id: team.get('team_id'),
      name
    });
  };

  openFormModal = ({ ...props }) => {
    const { nav } = this.props;

    nav.openModal(FormModal, props);
  };

  handleListClick = (i, button) => {
    const { team } = this.props;
    if (button.title === kDelete.title) {
      const modalOptions = {
        title: 'Delete team',
        subtitle:
          'Are you sure you want to delete this team? Deleting it is permanent and cannot be reversed.',
        inputs: [
          {
            type: 'password',
            placeholder: 'Password',
            autoFocus: true,
            label: `Confirm deleting "${team.get('name')}"`
          }
        ],
        onConfirm: this.handleDeleteTeam
      };
      return this.openFormModal(modalOptions);
    }
    if (button.title === kLeave.title) {
      const modalOptions = {
        title: 'Leave team',
        subtitle: 'Are you sure that you want to leave this team?',
        inputs: [
          {
            type: 'password',
            placeholder: 'Password',
            autoFocus: true,
            label: `Confirm leaving "${team.get('name')}"`
          }
        ],
        onConfirm: this.handleLeaveTeam
      };

      return this.openFormModal(modalOptions);
    }
  };

  render() {
    const { name, loader, meInTeam, text, color } = this.props;
    const isAdmin = meInTeam.get('admin');

    return (
      <CardHeader title={name} onTitleClick={this.openRenameModal}>
        {isAdmin && <SW.StatusBox color={color}>{text}</SW.StatusBox>}
        <SW.Button
          icon="ThreeDots"
          onClick={this.openContextMenu}
          status={loader.get('ThreeDots')}
        />
      </CardHeader>
    );
  }
}
