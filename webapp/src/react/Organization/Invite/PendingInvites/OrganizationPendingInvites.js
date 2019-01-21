import React, { PureComponent } from 'react';
import { setupLoading } from 'swipes-core-js/classes/utils';
import request from 'swipes-core-js/utils/request';
import SW from './OrganizationPendingInvites.swiss';

export default class OrganizationPendingInvites extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      showPendingInvites: false
    };

    setupLoading(this);
  }

  handleSendInviteCached = email => {
    const { organization } = this.props;
    const loadingKey = `${email}sendInvite`;
    this.setLoading(loadingKey);
    request('organization.inviteUser', {
      organization_id: organization.get('organization_id'),
      target_email: email
    }).then(res => {
      if (res && res.ok) {
        this.clearLoading(loadingKey, 'Invite sent', 1500);
      } else {
        this.clearLoading(loadingKey, '!Something went wrong', 3000);
      }
    });
  };

  handleRevokeInviteCached = email => {
    const { organization } = this.props;
    const loadingKey = `${email}revokeInvite`;

    this.setLoading(loadingKey);
    request('organization.inviteRevoke', {
      organization_id: organization.get('organization_id'),
      target_email: email
    }).then(res => {
      if (res && res.ok) {
        this.clearLoading(loadingKey);
      } else {
        this.clearLoading(loadingKey, '!Something went wrong', 3000);
      }
    });
  };

  togglePendingInvites = () => {
    const { showPendingInvites } = this.state;
    this.setState({ showPendingInvites: !showPendingInvites });
  };

  renderPendingInvites = () => {
    const { showPendingInvites } = this.state;
    const { organization } = this.props;

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
                  status={this.getLoading(`${email}sendInvite`)}
                />
                <SW.EmailButton
                  title="Revoke"
                  onClick={() => this.handleRevokeInviteCached(email)}
                  status={this.getLoading(`${email}revokeInvite`)}
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
