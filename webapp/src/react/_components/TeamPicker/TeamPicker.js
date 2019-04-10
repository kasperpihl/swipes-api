import React, { useRef, useEffect, useState } from 'react';
import { connect } from 'react-redux';

import cachedCallback from 'src/utils/cachedCallback';
import request from 'core/utils/request';

import useMyId from 'core/react/_hooks/useMyId';
import useLoader from 'src/react/_hooks/useLoader';

import InputRadio from '_shared/Input/Radio/InputRadio';
import InputText from '_shared/Input/Text/InputText';
import Button from '_shared/Button/Button';
import Spacing from '_shared/Spacing/Spacing';

import SW from './TeamPicker.swiss';

export default connect(state => ({
  teams: state.teams
}))(TeamPicker);

function TeamPicker({ teams, value, onChange, disablePersonal }) {
  const myId = useMyId();
  const loader = useLoader();
  const foundCheckedRef = useRef(false);
  const [inputVisible, handleShowInput] = useState(false);
  const [inputVal, changeInputValChange] = useState('');
  const [showTooltip, handleShowTooltip] = useState(false);
  const handleClickCached = cachedCallback((v, e) => {
    e.stopPropagation();
    onChange(v);
  });

  useEffect(() => {
    if (!foundCheckedRef.current) {
      let selectId = disablePersonal ? undefined : myId;
      if (teams.size) {
        selectId = teams.first().get('team_id');
      }

      selectId && onChange(selectId);
    }
  });

  const handleInputChange = e => {
    changeInputValChange(e.target.value);
  };

  const createTeam = e => {
    if (e.keyCode === 13 && typeof inputVal === 'string' && inputVal !== '') {
      loader.set('createTeam');
      request('team.add', {
        name: inputVal
      }).then(res => {
        if (res.ok) {
          loader.success('createTeam', 1500);
          window.analytics.sendEvent('Team created', res.team_id);
          handleShowInput(false);
        } else {
          loader.error(res.error, 1500);
        }
      });
    }
  };

  const showTeamCreateInput = () => {
    handleShowInput(!inputVisible);
  };

  const onFocus = () => {
    handleShowTooltip(true);
  };

  const onBlur = () => {
    handleShowTooltip(false);
  };

  foundCheckedRef.current = false;
  const renderInput = (myValue, title) => {
    const checked = myValue === value;
    if (checked) {
      foundCheckedRef.current = true;
    }
    return (
      <SW.InputWrapper key={myValue} onClick={handleClickCached(myValue)}>
        <InputRadio
          type="radio"
          value={myValue}
          label={title}
          checked={myValue === value}
          name="team"
          hideRadio
          onChange={handleClickCached(myValue)}
        />
      </SW.InputWrapper>
    );
  };

  return (
    <SW.Wrapper>
      <SW.TeamsWrapper>
        {teams
          .toList()
          .map(team => renderInput(team.get('team_id'), team.get('name')))}
        {!disablePersonal && renderInput(myId, 'Personal')}
        <Button
          title={inputVisible ? 'Cancel' : 'Create a team'}
          icon={inputVisible ? '' : 'Plus'}
          onClick={showTeamCreateInput}
          selected={inputVisible}
          border
          status={loader.get('createTeam')}
        />
      </SW.TeamsWrapper>
      {inputVisible && <Spacing height={9} />}
      {inputVisible && (
        <SW.TeamInput>
          <InputText
            type="text"
            onChange={handleInputChange}
            placeholder="Team name"
            onKeyDown={createTeam}
            onFocus={onFocus}
            onBlur={onBlur}
          />
          <SW.Tooltip show={showTooltip}>
            A 30-day trial will begin when you create this team. Don't forget to
            invite your collegues from your Profile.
          </SW.Tooltip>
        </SW.TeamInput>
      )}
    </SW.Wrapper>
  );
}
