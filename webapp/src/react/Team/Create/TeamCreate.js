import React, { useState, useReducer, Fragment } from 'react';

import request from 'core/utils/request';
import useLoader from 'src/react/_hooks/useLoader';
import useNav from 'src/react/_hooks/useNav';

import CardContent from '_shared/Card/Content/CardContent';
import InputText from '_shared/Input/Text/InputText';
import CardHeader from '_shared/Card/Header/CardHeader';
import Spacing from '_shared/Spacing/Spacing';
import Button from '_shared/Button/Button';

import SW from './TeamCreate.swiss';

const initialState = [
  {
    key: 'member-0',
    value: ''
  },
  {
    key: 'member-1',
    value: ''
  }
];

const regEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

function inputReducer(state, action) {
  switch (action.type) {
    case 'change':
      state[action.key].value = action.payload;
      return [...state];
    case 'add':
      return [...state, { key: `member-${state.length}`, value: '' }];
    default:
      return state;
  }
}

export default function TeamCreate() {
  const [teamName, handleTeamNameChange] = useState('');
  const [members, dispatch] = useReducer(inputReducer, initialState);

  const loader = useLoader();
  const nav = useNav();

  const handleInputChange = e => {
    handleTeamNameChange(e.target.value);
  };

  async function handleCreateTeam() {
    loader.set('create');
    const teamRes = await request('team.add', {
      name: teamName
    });
    const teamId = teamRes.team_id;
    await Promise.all(
      members
        .filter(({ value }) => !!value)
        .map(({ value }) =>
          request('team.inviteUser', {
            team_id: teamId,
            target_email: value
          })
        )
    ).then(() => {
      loader.clear('create');
    });
  }

  const handleCancel = () => {
    nav.pop();
  };

  return (
    <CardContent header={<CardHeader title="Invite your team to join in!" />}>
      <SW.Wrapper>
        <Spacing height={69} />
        <InputText
          type="text"
          placeholder="Give your team a name"
          value={teamName}
          onChange={handleInputChange}
        />
        <Spacing height={56} />
        <SW.Text>Invite your colleagues!</SW.Text>
        <Spacing height={18} />
        {members.map((member, i) => {
          const error = !regEx.exec(member.value);
          return (
            <Fragment key={member.key}>
              <SW.InputWrapper>
                <InputText
                  type="email"
                  placeholder="Email"
                  value={member.value}
                  error={member.value !== '' && error}
                  onChange={e =>
                    dispatch({
                      type: 'change',
                      key: i,
                      payload: e.target.value
                    })
                  }
                />
                {member.value !== '' && error && (
                  <SW.ErrorLabel>Please enter a valid email</SW.ErrorLabel>
                )}
              </SW.InputWrapper>
              <Spacing height={18} />
            </Fragment>
          );
        })}
        <Button
          icon="CircledPlus"
          title="Invite more"
          onClick={() => dispatch({ type: 'add' })}
        />
        <SW.ActionsWrapper>
          <Button title="Cancel" onClick={handleCancel} border />
          <Button
            title="Start collaborating!"
            onClick={handleCreateTeam}
            status={loader.get('create')}
            green
          />
        </SW.ActionsWrapper>
      </SW.Wrapper>
    </CardContent>
  );
}
