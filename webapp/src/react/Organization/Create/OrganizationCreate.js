import React, { useState } from 'react';
import CardContent from 'src/react/_components/Card/Content/CardContent';
import InputText from 'src/react/_components/Input/Text/InputText';
import Spacing from 'src/react/_components/Spacing/Spacing';
import OrganizationHeader from 'src/react/Organization/Header/OrganizationHeader';
import SW from './OrganizationCreate.swiss';

export default function OrganizationCreate() {
  const [teamName, handleTeamNameChange] = useState('');

  const handleInputChange = e => {
    handleTeamNameChange(e.target.value);
  };

  console.log(teamName);
  return (
    <CardContent header={<OrganizationCreateHeader />}>
      <SW.Wrapper>
        <InputText
          type="text"
          placeholder="Give a title to your team"
          value={teamName}
          onChange={handleInputChange}
        />
        <Spacing height={9} />
        <InputText
          type="email"
          placeholder="Invite a teammate"
          value={teamName}
          onChange={handleInputChange}
        />
      </SW.Wrapper>
    </CardContent>
  );
}
