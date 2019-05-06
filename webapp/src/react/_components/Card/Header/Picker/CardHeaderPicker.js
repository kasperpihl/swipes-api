import React from 'react';
import { connect } from 'react-redux';
import * as types from 'src/redux/constants';
import contextMenu from 'src/utils/contextMenu';
import ListMenu from 'src/react/_components/ListMenu/ListMenu';
import useMyId from 'core/react/_hooks/useMyId';

import SW from './CardHeaderPicker.swiss';

export default connect(state => ({
  selectedTeamId: state.main.get('selectedTeamId'),
  teams: state.teams
}))(CardHeaderPicker);

function CardHeaderPicker({ teams, selectedTeamId, dispatch }) {
  const myId = useMyId();
  const buttons = teams
    .toArray()
    .map(team => ({ title: team.get('name'), id: team.get('team_id') }))
    .concat([{ title: 'Personal', id: myId }]);

  const onSelect = i => {
    dispatch({
      type: types.SET_SELECTED_TEAM_ID,
      payload: {
        selectedTeamId: buttons[i].id
      }
    });
  };

  const onClick = e => {
    contextMenu(ListMenu, e, {
      onClick: onSelect,
      buttons: buttons
    });
  };

  const teamName = teams.getIn([selectedTeamId, 'name']) || 'Personal';

  return (
    <SW.Wrapper onClick={onClick}>
      <SW.Text>{teamName}</SW.Text>
      <SW.Icon icon="ArrowDown" />
    </SW.Wrapper>
  );
}
