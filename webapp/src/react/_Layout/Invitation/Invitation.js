import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import withLoader from 'src/react/_hocs/withLoader';
import request from 'core/utils/request';
import * as invitationActions from 'src/redux/invitation/invitationActions';
import Button from 'src/react/_components/Button/Button';
import SW from './Invitation.swiss';

@connect(
  state => ({
    invitedToOrg: state.invitation.get('invitedToOrg'),
    organizations: state.organizations
  }),
  {
    invitationClear: invitationActions.clear
  }
)
@withLoader
export default class Invitation extends PureComponent {
  handleDecline = () => {
    const { invitationClear } = this.props;
    invitationClear();
  };
  handleJoin = () => {
    const { invitedToOrg, invitationClear, loader } = this.props;
    loader.set('loader');
    request('organization.join', {
      invitation_token: invitedToOrg.get('invitation_token')
    }).then(res => {
      if (res.ok) {
        loader.clear('loader');
        invitationClear();
      } else {
        loader.error('loader', res.error);
      }
    });
  };
  handleLogout = () => {
    const { loader } = this.props;
    loader.set('loader');
    request('user.signout').then(res => {
      if (res.error) {
        loader.error('loader', res.error);
      }
    });
  };
  render() {
    const { invitedToOrg, loader, organizations } = this.props;
    if (!invitedToOrg) {
      return null;
    }

    let title = `Join ${invitedToOrg.get('name')}`;
    let paragraph = `Do you want to join the team "${invitedToOrg.get(
      'name'
    )}"?`;
    let actions = [
      <Button
        key="join"
        title="Join"
        onClick={this.handleJoin}
        status={loader.get('loader')}
      />,
      <Button key="decline" title="Decline" onClick={this.handleDecline} />
    ];

    if (organizations.get(invitedToOrg.get('organization_id'))) {
      // User is already in this org (most likely clicked)
      title = 'Already part of team';
      paragraph = `Looks like you are already part of the team "${invitedToOrg.get(
        'name'
      )}".`;
      actions = [
        <Button
          key="change"
          border
          title="Change account"
          onClick={this.handleLogout}
          status={loader.get('loader')}
        />,
        <Button key="close" title="Close" border onClick={this.handleDecline} />
      ];
    }

    return (
      <SW.PopupWrapper>
        <SW.Popup>
          <SW.Title>{title}</SW.Title>
          <SW.Paragraph>{paragraph}</SW.Paragraph>
          <SW.Actions>{actions}</SW.Actions>
        </SW.Popup>
      </SW.PopupWrapper>
    );
  }
}
