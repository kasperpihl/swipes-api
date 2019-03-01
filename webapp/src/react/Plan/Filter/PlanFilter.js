import React, { Fragment, useReducer } from 'react';

import cachedCallback from 'src/utils/cachedCallback';
import usePaginationRequest from 'core/react/_hooks/usePaginationRequest';
import RequestLoader from 'src/react/_components/RequestLoader/RequestLoader';
import SectionHeader from 'src/react/_components/SectionHeader/SectionHeader';
import PlanProject from 'src/react/Plan/Project/PlanProject';
import Button from 'src/react/_components/Button/Button';

import SW from './PlanFilter.swiss';

export default function PlanFilter({ plan }) {
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
      delete newState[key];
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
      {req.items.map(({ name, project_id }) => (
        <Fragment key={project_id}>
          <SectionHeader>
            {name}
            <SW.ButtonWrapper expanded={expanded[project_id]}>
              <Button
                icon="ArrowRightFull"
                onClick={handleClickCached(project_id)}
              />
            </SW.ButtonWrapper>
          </SectionHeader>
          {expanded[project_id] && <PlanProject projectId={project_id} />}
        </Fragment>
      ))}
    </SW.Wrapper>
  );
}
