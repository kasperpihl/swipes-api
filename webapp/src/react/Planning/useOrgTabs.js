import { useState } from 'react';
import useMyId from 'core/react/_hooks/useMyId';

export default function useOrgTabs(organizations) {
  const myId = useMyId();

  const [tabIndex, setTabIndex] = useState(0);

  const tabs = organizations
    .toArray()
    .map(org => ({ title: org.get('name'), id: org.get('organization_id') }))
    .concat([{ title: 'Personal', id: myId }]);

  return [tabs, tabIndex, setTabIndex];
}
