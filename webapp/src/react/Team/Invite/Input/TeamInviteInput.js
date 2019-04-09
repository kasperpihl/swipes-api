import React, { useState } from 'react';

import useLoader from 'src/react/_hooks/useLoader';
import request from 'core/utils/request';

import InputText from '_shared/Input/Text/InputText';

import SW from './TeamInviteInput.swiss';
import SectionHeader from '_shared/SectionHeader/SectionHeader';
import Button from '_shared/Button/Button';

export default function TeamInviteInput({ teamId, handleClick, showInvites }) {
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

  const handleKeyDown = e => {
    if (e.keyCode === 13) {
      e.preventDefault();
      handleSendInvite();
    }
  };

  return (
    <SW.Wrapper>
      <SectionHeader>
        <SW.Text>Invite new members</SW.Text>
        <SW.ButtonWrapper clicked={showInvites}>
          <Button icon="ArrowDown" onClick={handleClick} />
        </SW.ButtonWrapper>
      </SectionHeader>
      <SW.InputWrapper>
        <InputText
          type="email"
          placeholder="Email"
          autoFocus
          onChange={handleEmailChange}
          value={emailValue}
          onKeyDown={handleKeyDown}
        />
        <SW.Button
          title="Send Invite"
          onClick={handleSendInvite}
          status={loader.get('sendInvite')}
          border
        />
      </SW.InputWrapper>
    </SW.Wrapper>
  );
}
