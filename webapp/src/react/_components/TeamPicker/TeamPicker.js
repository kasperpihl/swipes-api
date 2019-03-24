import React, { useRef, useEffect } from 'react';
import { connect } from 'react-redux';
import cachedCallback from 'src/utils/cachedCallback';
import InputRadio from '_shared/Input/Radio/InputRadio';
import SW from './TeamPicker.swiss';
import useMyId from 'core/react/_hooks/useMyId';

export default connect(state => ({
  teams: state.teams
}))(TeamPicker);

function TeamPicker({ teams, value, onChange, disablePersonal }) {
  const myId = useMyId();
  const foundCheckedRef = useRef(false);
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
          label={title}
          value={myValue}
          checked={myValue === value}
          name="team"
          onChange={handleClickCached(myValue)}
        />
      </SW.InputWrapper>
    );
  };

  return (
    <SW.Wrapper>
      {!disablePersonal && renderInput(myId, 'Personal')}
      {teams
        .toList()
        .map(team => renderInput(team.get('team_id'), team.get('name')))}
    </SW.Wrapper>
  );
}
