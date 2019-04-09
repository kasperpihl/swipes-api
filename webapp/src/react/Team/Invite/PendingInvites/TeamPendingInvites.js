import React from 'react';

import useLoader from 'src/react/_hooks/useLoader';
import request from 'core/utils/request';

import Button from '_shared/Button/Button';

import SW from './TeamPendingInvites.swiss';

export default function TeamPendingInvites({ team, showInvites }) {
  const loader = useLoader();

  const handleSendInviteCached = email => {
    const loadingKey = `${email}sendInvite`;
    loader.set(loadingKey);
    request('team.inviteUser', {
      team_id: team.get('team_id'),
      target_email: email
    }).then(res => {
      if (res && res.ok) {
        loader.success(loadingKey, 'Invite sent', 1500);
      } else {
        loader.error(loadingKey, res.error, 3000);
      }
    });
  };

  const handleRevokeInviteCached = email => {
    const loadingKey = `${email}revokeInvite`;

    loader.set(loadingKey);
    request('team.inviteRevoke', {
      team_id: team.get('team_id'),
      target_email: email
    }).then(res => {
      if (res && res.ok) {
        loader.clear(loadingKey);
      } else {
        loader.error(loadingKey, res.error, 3000);
      }
    });
  };

  const pendingUsersArr = team.get('pending_users').keySeq();

  if (!pendingUsersArr.size) {
    return null;
  }

  return (
    <SW.Wrapper show={showInvites}>
      {team
        .get('pending_users')
        .map((ts, email) => (
          <SW.InviteItem key={email}>
            <SW.InviteEmail>{email}</SW.InviteEmail>
            <SW.ButtonWrapper>
              <Button
                title="Resend"
                onClick={() => handleSendInviteCached(email)}
                status={loader.get(`${email}sendInvite`)}
              />
            </SW.ButtonWrapper>
            <SW.ButtonWrapper>
              <Button
                title="Revoke"
                onClick={() => handleRevokeInviteCached(email)}
                status={loader.get(`${email}revokeInvite`)}
              />
            </SW.ButtonWrapper>
          </SW.InviteItem>
        ))
        .toList()}
    </SW.Wrapper>
  );
}
