import React, { Fragment, useReducer, useMemo } from 'react';

import cachedCallback from 'src/utils/cachedCallback';
import usePaginationRequest from 'core/react/_hooks/usePaginationRequest';
import usePlanProjectSelect from 'src/react/Plan/usePlanProjectSelect';
import RequestLoader from 'src/react/_components/RequestLoader/RequestLoader';

import PlanSelectProject from './Project/PlanSelectProject';
import PlanAlert from 'src/react/Plan/Alert/PlanAlert';
import PlanSideDraft from 'src/react/Plan/Side/Draft/PlanSideDraft';

import SW from './PlanSelect.swiss';
import Spacing from 'src/react/_components/Spacing/Spacing';

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

  const defaultObject = useMemo(() => {
    const defaultExpanded = {};
    plan.tasks.forEach(({ project_id }) => {
      defaultExpanded[project_id] = true;
    });
    return defaultExpanded;
  }, []);

  const [expanded, toggleExpanded] = useReducer((state, key) => {
    const newState = { ...state };
    if (state[key]) {
      newState[key] = false;
    } else {
      newState[key] = true;
    }
    return newState;
  }, defaultObject);

  const [selectedTasks, handleToggleTask] = usePlanProjectSelect(plan);

  if (!req.items) {
    return <RequestLoader req={req} />;
  }

  const handleClickCached = cachedCallback(key => toggleExpanded(key));

  return (
    <SW.Wrapper>
      <PlanSideDraft plan={plan} selectedCounter={selectedTasks.length} />
      <SW.Content>
        <PlanAlert
          title="Plan draft"
          message="Select tasks from projects and start plan."
          type="draft"
        />
        {req.items.map(({ title, project_id, completion_percentage }) => {
          const count = selectedTasks.filter(key => key.startsWith(project_id))
            .length;
          // Don't include completed projects
          if (completion_percentage === 100) return null;
          return (
            <Fragment key={project_id}>
              <SW.SectionHeader onClick={handleClickCached(project_id)}>
                {`${title}${count ? ` (${count})` : ''}`}
                <Spacing width="100%" />
                <SW.Icon
                  icon="ArrowRightFull"
                  expanded={expanded[project_id]}
                />
              </SW.SectionHeader>
              {typeof expanded[project_id] !== 'undefined' && (
                <PlanSelectProject
                  projectId={project_id}
                  selectedTasks={selectedTasks}
                  onToggleTask={handleToggleTask}
                  hidden={!expanded[project_id]}
                />
              )}
            </Fragment>
          );
        })}
      </SW.Content>
    </SW.Wrapper>
  );
}
