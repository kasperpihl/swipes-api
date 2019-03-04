import React, { Fragment, useReducer } from 'react';

import cachedCallback from 'src/utils/cachedCallback';
import usePaginationRequest from 'core/react/_hooks/usePaginationRequest';
import RequestLoader from 'src/react/_components/RequestLoader/RequestLoader';

import PlanProject from 'src/react/Plan/Project/PlanProject';
import PlanAlert from 'src/react/Plan/Alert/PlanAlert';

import SW from './PlanSelect.swiss';

export default function PlanSelect({ plan }) {
  const req = usePaginationRequest(
    'project.list',
    {
      owned_by: plan.owned_by
    },
    {
      cursorKey: 'skip',
      idAttribute: 'project_id',
      resultPath: 'projects'
    }
  );

  const [expanded, toggleKey] = useReducer((state, key) => {
    const newState = { ...state };
    if (state[key]) {
      newState[key] = false;
    } else {
      newState[key] = true;
    }
    return newState;
  }, {});

  if (!req.items) {
    return <RequestLoader req={req} />;
  }

  const handleClickCached = cachedCallback(key => toggleKey(key));

  return (
    <SW.Wrapper>
      <PlanAlert
        title="Plan draft"
        message="Select tasks and click start"
        type="draft"
      />
      {req.items.map(({ title, project_id }) => (
        <Fragment key={project_id}>
          <SW.SectionHeader onClick={handleClickCached(project_id)}>
            {title}
            <SW.Icon icon="ArrowRightFull" expanded={expanded[project_id]} />
          </SW.SectionHeader>
          {typeof expanded[project_id] !== 'undefined' && (
            <PlanProject
              projectId={project_id}
              hidden={!expanded[project_id]}
            />
          )}
        </Fragment>
      ))}
    </SW.Wrapper>
  );
}
