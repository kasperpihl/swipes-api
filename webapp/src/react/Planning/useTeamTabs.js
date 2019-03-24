import { useState } from 'react';
import useMyId from 'core/react/_hooks/useMyId';

export default function useTeamTabs(teams) {
  const myId = useMyId();

  const [tabIndex, setTabIndex] = useState(0);

  const tabs = teams
    .toArray()
    .map(team => ({ title: team.get('name'), id: team.get('team_id') }))
    .concat([{ title: 'Personal', id: myId }]);

  return [tabs, tabIndex, setTabIndex];
}
