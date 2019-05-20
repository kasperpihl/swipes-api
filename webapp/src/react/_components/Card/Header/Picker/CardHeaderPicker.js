import React from 'react';
import { connect } from 'react-redux';
import * as types from 'src/redux/constants';
import contextMenu from 'src/utils/contextMenu';
import ListMenu from 'src/react/_components/ListMenu/ListMenu';
import useMyId from 'core/react/_hooks/useMyId';

import SW from './CardHeaderPicker.swiss';

export default connect(state => ({
  selectedTeamId: state.main.get('selectedTeamId'),
  teams: state.teams,
  unreadByTeam: state.connection.get('unreadByTeam')
}))(CardHeaderPicker);

function CardHeaderPicker({
  teams,
  selectedTeamId,
  unreadByTeam,
  dispatch,
  showUnreadCounter
}) {
  const myId = useMyId();

  const buttons = teams
    .toArray()
    .map(team => {
      const id = team.get('team_id');
      const count =
        showUnreadCounter &&
        unreadByTeam &&
        id !== selectedTeamId &&
        unreadByTeam.get(id)
          ? unreadByTeam.get(id).size
          : 0;
      return {
        title: `${team.get('name')}${count ? ` (${count})` : ''}`,
        id: team.get('team_id')
      };
    })
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
    contextMenu(
      ListMenu,
      {
        boundingRect: e.target.getBoundingClientRect()
      },
      {
        onClick: onSelect,
        buttons: buttons
      }
    );
  };

  let additionalNotifications = 0;
  if (showUnreadCounter && unreadByTeam) {
    unreadByTeam.forEach((unread, teamId) => {
      if (teamId !== selectedTeamId) {
        additionalNotifications += unread.size;
      }
    });
  }

  const teamName = teams.getIn([selectedTeamId, 'name']) || 'Personal';

  return (
    <SW.Wrapper onClick={onClick}>
      <SW.Text>{teamName}</SW.Text>

      <SW.Icon icon="ArrowDown" />
      <SW.NotificationCounter show={!!additionalNotifications}>
        {additionalNotifications}
      </SW.NotificationCounter>
    </SW.Wrapper>
  );
}
