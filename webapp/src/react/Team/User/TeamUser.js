import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import Button from 'src/react/_components/Button/Button';
import * as mainActions from 'src/redux/main/mainActions';
import withLoader from 'src/react/_hocs/withLoader';
import UserImage from 'src/react/_components/UserImage/UserImage';
import FormModal from 'src/react/_components/FormModal/FormModal';
import ListMenu from 'src/react/_components/ListMenu/ListMenu';
import withNav from 'src/react/_hocs/Nav/withNav';
import request from 'core/utils/request';
import SW from './TeamUser.swiss';

const kPromote = 'Promote to admin';
const kDemote = 'Demote to user';
const kDisable = 'Disable user';
const kTransfer = 'Transfer ownership';
const kInvite = 'Invite user';

@withNav
@withLoader
@connect(
  (state, props) => ({
    team: state.teams.get(props.teamId)
  }),
  {
    contextMenu: mainActions.contextMenu
  }
)
export default class TeamUser extends PureComponent {
  constructor(props) {
    super(props);
  }
  getOptionsForE = e => {
    return {
      boundingRect: e.target.getBoundingClientRect(),
      alignX: 'right',
      excludeY: true,
      positionY: 12
    };
  };
  openTransferModal() {
    const { nav, user } = this.props;
    nav.openModal(FormModal, {
      title: 'Transfer ownership of team',
      subtitle:
        'Warrning: Transferring the ownership is permanent and it cannot be reversed!',
      inputs: [
        {
          type: 'password',
          placeholder: 'Password',
          autoFocus: true,
          label: `Confirm transferring ownership to "${user.get('first_name')}"`
        }
      ],
      onConfirm: this.handleTransferOwnership
    });
  }
  handleTransferOwnership = ([password]) => {
    const { team, user, loader } = this.props;

    loader.set('buttonClicked');
    request('team.transferOwnership', {
      team_id: team.get('team_id'),
      target_user_id: user.get('user_id'),
      password
    }).then(res => {
      if (res.ok) {
        loader.success('buttonClicked', 'Transferred');
      } else {
        loader.error('buttonClicked', res.error, 3000);
      }
    });
  };
  handleListClick = (i, title) => {
    const { team, user, loader } = this.props;

    if (loader.check('buttonClicked')) {
      return;
    }

    if (title === kTransfer) {
      return this.openTransferModal();
    }

    let endpoint;
    let buttonMessage;
    const options = {
      team_id: team.get('team_id'),
      target_user_id: user.get('user_id')
    };
    if (title === kDemote) {
      endpoint = 'team.demoteAdmin';
      buttonMessage = 'Demoted';
    } else if (title === kPromote) {
      endpoint = 'team.promoteAdmin';
      buttonMessage = 'Promoted';
    } else if (title === kDisable) {
      endpoint = 'team.disableUser';
      buttonMessage = 'Deactivated';
    } else if (title === kInvite) {
      delete options.target_user_id;
      options.target_email = user.get('email');
      endpoint = 'team.inviteUser';
      buttonMessage = 'Invite sent';
    }

    loader.set('buttonClicked');
    request(endpoint, options).then(res => {
      if (res.ok) {
        loader.success('buttonClicked', buttonMessage, 1500);
      } else {
        loader.error('buttonClicked', res.error, 2000);
      }
    });
  };
  openListMenu = e => {
    const { contextMenu, team, user, meInTeam } = this.props;
    const options = this.getOptionsForE(e);
    const meTag = this.getUserTag(
      team.getIn(['users', meInTeam.get('user_id')])
    );
    const targetTag = this.getUserTag(user);

    if (meTag === 'User' || targetTag === 'Owner') {
      return;
    }
    let buttons = [kPromote, kDisable];
    if (targetTag === 'Admin') {
      buttons[0] = kDemote;
    }
    if (meTag === 'Owner') {
      buttons.push(kTransfer);
    }
    if (targetTag === 'Deactivated') {
      buttons = [kInvite];
    }

    contextMenu({
      options,
      component: ListMenu,
      props: {
        buttons,
        onClick: this.handleListClick
      }
    });
  };

  handlePromoteAdmin = () => {
    const { team, user } = this.props;

    request('team.promoteAdmin', {
      team_id: team.get('team_id'),
      target_user_id: user.get('user_id')
    });
  };

  handleDemoteAdmin = () => {
    const { team, user } = this.props;

    request('team.demoteAdmin', {
      team_id: team.get('team_id'),
      target_user_id: user.get('user_id')
    });
  };

  getUserTag = user => {
    const { team } = this.props;
    if (user.get('user_id') === team.get('owner_id')) {
      return 'Owner';
    }
    if (user.get('admin')) {
      return 'Admin';
    }
    if (user.get('status') === 'disabled') {
      return 'Deactivated';
    }
    return 'User';
  };

  render() {
    const { user, team, meInTeam, loader, showInvites } = this.props;
    const isOwner = this.getUserTag(user) === 'Owner';
    const meUser =
      this.getUserTag(meInTeam) !== 'Owner' &&
      this.getUserTag(meInTeam) !== 'Admin';

    return (
      <SW.Wrapper>
        <UserImage
          userId={user.get('user_id')}
          teamId={team.get('team_id')}
          size={28}
        />
        <SW.Name>
          {user.get('first_name')} {user.get('last_name')}
        </SW.Name>
        <SW.Email>{user.get('email')}</SW.Email>
        <SW.UserType>{this.getUserTag(user)}</SW.UserType>
        {(isOwner && this.getUserTag(user) !== 'active') ||
        (meUser && this.getUserTag(user) !== 'active') ? null : (
          <SW.ButtonWrapper show={showInvites}>
            <Button
              icon="ThreeDots"
              onClick={this.openListMenu}
              status={loader.get('buttonClicked')}
            />
          </SW.ButtonWrapper>
        )}
      </SW.Wrapper>
    );
  }
}
