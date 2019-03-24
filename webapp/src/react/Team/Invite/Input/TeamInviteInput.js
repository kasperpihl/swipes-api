import React, { useState } from 'react';
import useLoader from 'src/react/_hooks/useLoader';
import request from 'core/utils/request';
import SW from './TeamInviteInput.swiss';

export default function TeamInviteInput({ teamId }) {
  const loader = useLoader();
  const [emailValue, setEmailValue] = useState('');

  const handleEmailChange = e => setEmailValue(e.target.value);

  const handleSendInvite = () => {
    loader.set('sendInvite');
    request('team.inviteUser', {
      team_id: teamId,
      target_email: emailValue
    }).then(res => {
      if (res && res.ok) {
        setEmailValue('');
        loader.success('sendInvite', 'Invite sent', 1500);
      } else {
        loader.error('sendInvite', res.error, 3000);
      }
    });
  };

  const handleKeyUp = e => {
    if (e.keyCode === 13) {
      e.preventDefault();
      handleSendInvite();
    }
  };

  return (
    <SW.Wrapper>
      <SW.InviteText>Invite others to join</SW.InviteText>
      <SW.InputWrapper>
        <SW.EmailInput
          type="email"
          placeholder="Email"
          autoFocus
          onChange={handleEmailChange}
          value={emailValue}
          onKeyUp={handleKeyUp}
        />
        <SW.SendButton
          title="Send Invite"
          onClick={handleSendInvite}
          status={loader.get('sendInvite')}
        />
      </SW.InputWrapper>
    </SW.Wrapper>
  );
}
