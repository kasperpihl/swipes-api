import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import * as mainActions from 'src/redux/main/mainActions';
import withLoader from 'src/react/_hocs/withLoader';
import UserImage from 'src/react/components/UserImage/UserImage';
import ListMenu from 'src/react/context-menus/ListMenu/ListMenu';
import navWrapper from 'src/react/app/view-controller/NavWrapper';
import request from 'swipes-core-js/utils/request';
import SW from './OrganizationUser.swiss';

const kPromote = 'Promote';
const kDemote = 'Demote';
const kDisable = 'Disable';
const kTransfer = 'Transfer';
const kInvite = 'Invite';
@navWrapper
@withLoader
@connect(
  (state, props) => ({
    organization: state.organization.get(props.organizationId)
  }),
  {
    contextMenu: mainActions.contextMenu
  }
)
export default class OrganizationUser extends PureComponent {
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
  handleListClick = (i, title) => {
    const { organization, user, loader } = this.props;
    let endpoint;
    let buttonMessage;
    const options = {
      organization_id: organization.get('organization_id'),
      target_user_id: user.get('user_id')
    };
    if (title === kDemote) {
      endpoint = 'organization.demoteAdmin';
      buttonMessage = 'Demoted';
    } else if (title === kPromote) {
      endpoint = 'organization.promoteAdmin';
      buttonMessage = 'Promoted';
    } else if (title === kDisable) {
      endpoint = 'organization.disableUser';
      buttonMessage = 'Disabled';
    } else if (title === kTransfer) {
      endpoint = 'organization.transferOwnership';
      buttonMessage = 'Transferred';
    } else if (title === kInvite) {
      delete options.target_user_id;
      options.target_email = user.get('email');
      endpoint = 'organization.inviteUser';
      buttonMessage = 'Invite sent';
    }
    if (loader.check('buttonClicked')) {
      return;
    }
    loader.set('buttonClicked');
    if (endpoint) {
      request(endpoint, options).then(res => {
        if (res.ok) {
          loader.clear('buttonClicked');
        } else {
          loader.error('buttonClicked', res.error);
        }
      });
    }
  };
  openListMenu = e => {
    const { contextMenu, organization, user, me } = this.props;
    const options = this.getOptionsForE(e);
    const meTag = this.getUserTag(
      organization.getIn(['users', me.get('user_id')])
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
    if (targetTag === 'Disabled') {
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

  getUserTag = user => {
    const { organization } = this.props;
    if (user.get('user_id') === organization.get('owner_id')) {
      return 'Owner';
    }
    if (user.get('admin')) {
      return 'Admin';
    }
    if (user.get('status') === 'disabled') {
      return 'Disabled';
    }
    return 'User';
  };

  render() {
    const { user, organization, me, loader } = this.props;
    const isOwner = this.getUserTag(user) === 'Owner';
    const isUser =
      this.getUserTag(user) === 'User' && this.getUserTag(me) === 'User';

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
        {isOwner || isUser ? null : (
          <SW.OptionsButton
            icon="ThreeDots"
            onClick={this.openListMenu}
            {...loader.get('buttonClicked')}
          />
        )}
        <SW.UserType>{this.getUserTag(user)}</SW.UserType>
      </SW.Wrapper>
    );
  }
}
