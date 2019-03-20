import { useState, useContext } from 'react';
import { MyIdContext } from 'src/react/contexts';

export default function useOrgTabs(organizations) {
  const myId = useContext(MyIdContext);

  const [tabIndex, setTabIndex] = useState(0);

  const tabs = organizations
    .toArray()
    .map(org => ({ title: org.get('name'), id: org.get('organization_id') }))
    .concat([{ title: 'Personal', id: myId }]);

  return [tabs, tabIndex, setTabIndex];
}
