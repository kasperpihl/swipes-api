import React, { PureComponent } from 'react';
import withLoader from 'src/react/_hocs/withLoader';
import request from 'core/utils/request';
import SW from './OrganizationPendingInvites.swiss';

@withLoader
export default class OrganizationPendingInvites extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      showPendingInvites: false
    };
  }

  handleSendInviteCached = email => {
    const { organization, loader } = this.props;
    const loadingKey = `${email}sendInvite`;
    loader.set(loadingKey);
    request('organization.inviteUser', {
      organization_id: organization.get('organization_id'),
      target_email: email
    }).then(res => {
      if (res && res.ok) {
        loader.success(loadingKey, 'Invite sent', 1500);
      } else {
        loader.error(loadingKey, res.error, 3000);
      }
    });
  };

  handleRevokeInviteCached = email => {
    const { organization, loader } = this.props;
    const loadingKey = `${email}revokeInvite`;

    loader.set(loadingKey);
    request('organization.inviteRevoke', {
      organization_id: organization.get('organization_id'),
      target_email: email
    }).then(res => {
      if (res && res.ok) {
        loader.clear(loadingKey);
      } else {
        loader.error(loadingKey, res.error, 3000);
      }
    });
  };

  togglePendingInvites = () => {
    const { showPendingInvites } = this.state;
    this.setState({ showPendingInvites: !showPendingInvites });
  };

  renderPendingInvites = () => {
    const { showPendingInvites } = this.state;
    const { organization, loader } = this.props;

    if (showPendingInvites) {
      return (
        <SW.PendingInvites>
          {organization
            .get('pending_users')
            .map((ts, email) => (
              <SW.InviteItem key={email}>
                <SW.InviteEmail>{email}</SW.InviteEmail>
                <SW.EmailButton
                  title="Resend"
                  onClick={() => this.handleSendInviteCached(email)}
                  status={loader.get(`${email}sendInvite`)}
                />
                <SW.EmailButton
                  title="Revoke"
                  onClick={() => this.handleRevokeInviteCached(email)}
                  status={loader.get(`${email}revokeInvite`)}
                />
              </SW.InviteItem>
            ))
            .toList()}
        </SW.PendingInvites>
      );
    }
    return null;
  };

  render() {
    const { showPendingInvites } = this.state;
    const { organization } = this.props;
    const pendingUsersArr = organization.get('pending_users').keySeq();

    if (!pendingUsersArr.size) {
      return null;
    }

    return (
      <SW.Wrapper>
        <SW.SectionTitle onClick={this.togglePendingInvites}>
          Pending invitations ({pendingUsersArr.size})
          <SW.IconWrapper>
            <SW.Icon
              icon="ArrowRightFull"
              width="24"
              height="24"
              showInvites={showPendingInvites}
            />
          </SW.IconWrapper>
        </SW.SectionTitle>
        {this.renderPendingInvites()}
      </SW.Wrapper>
    );
  }
}
