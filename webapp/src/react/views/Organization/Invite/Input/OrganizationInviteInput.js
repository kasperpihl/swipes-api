import React, { PureComponent } from 'react';
import { setupLoading } from 'swipes-core-js/classes/utils';
import request from 'swipes-core-js/utils/request';
import SW from './OrganizationInviteInput.swiss';

export default class OrganizationInviteInput extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      emailInputValue: ''
    };
    setupLoading(this);
  }

  handleEmailChange = e => {
    this.setState({ emailInputValue: e.target.value });
  };

  handleSendInviteCached = () => {
    const { organizationId } = this.props;
    const { emailInputValue } = this.state;
    this.setLoading('sendInvite');
    request('organization.inviteUser', {
      organization_id: organizationId,
      target_email: emailInputValue
    }).then(res => {
      if (res && res.ok) {
        this.setState({ emailInputValue: '' });
        this.clearLoading('sendInvite', 'Invite sent', 1500);
      } else {
        this.clearLoading('sendInvite', '!Something went wrong', 3000);
      }
    });
  };

  handleClick = e => {
    const { emailInputValue } = this.state;
    e.preventDefault();
    if (e.keyCode === 13) {
      this.handleSendInviteCached(emailInputValue);
    }
  };

  render() {
    return (
      <SW.Wrapper>
        <SW.InviteText>Invite others to join</SW.InviteText>
        <SW.InputWrapper>
          <SW.EmailInput
            type="email"
            placeholder="Email"
            autoFocus
            onChange={this.handleEmailChange}
            value={this.state.emailInputValue}
            onKeyUp={this.handleClick}
          />
          <SW.SendButton
            title="Send Invite"
            onClick={this.handleSendInviteCached}
            {...this.getLoading('sendInvite')}
          />
        </SW.InputWrapper>
      </SW.Wrapper>
    );
  }
}
