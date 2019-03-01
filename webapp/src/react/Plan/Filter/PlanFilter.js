import React from 'react';
import useRequest from 'core/react/_hooks/useRequest';
import RequestLoader from 'src/react/_components/RequestLoader/RequestLoader';

import SW from './PlanFilter.swiss';

export default function PlanFilter({ plan }) {
  const req = usePaginationRequest('project.list', {
    owned_by: plan.owned_by
  });
  if (!req.items) {
    return <RequestLoader />;
  }
  return (
    <SW.Wrapper>
      {req.items.map(proj => (
        <span key={proj.project_id}>{proj.name}</span>
      ))}
    </SW.Wrapper>
  );
}
