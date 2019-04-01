import React from 'react';

import useNav from 'src/react/_hooks/useNav';

import Button from '_shared/Button/Button';
import Spacing from '_shared/Spacing/Spacing';

import SW from './CreateTeamModal.swiss';

export default function CreateTeamModal() {
  const nav = useNav();
  const openTeamCreate = e => {
    nav.push({
      screenId: 'TeamCreate',
      crumbTitle: 'TeamCreate'
    });
  };

  return (
    <SW.CTContainer>
      <SW.CTTitle>Chats are better when there’s someone to talk to.</SW.CTTitle>
      <Spacing height={12} />
      <SW.CTText>
        Create a team and invite your teammates to start collaborating!
      </SW.CTText>
      <Spacing height={14} />
      <Button title="Create a team" border onClick={openTeamCreate} />
    </SW.CTContainer>
  );
}
