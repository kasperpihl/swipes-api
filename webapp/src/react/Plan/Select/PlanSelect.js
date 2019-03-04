import React, { Fragment, useReducer } from 'react';

import cachedCallback from 'src/utils/cachedCallback';
import usePaginationRequest from 'core/react/_hooks/usePaginationRequest';
import RequestLoader from 'src/react/_components/RequestLoader/RequestLoader';
import request from 'core/utils/request';

import PlanProject from 'src/react/Plan/Project/PlanProject';
import PlanAlert from 'src/react/Plan/Alert/PlanAlert';
import PlanSideDraft from 'src/react/Plan/Side/Draft/PlanSideDraft';

import SW from './PlanSelect.swiss';

export default function PlanSelect({ plan, editing }) {
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

  const [expanded, toggleExpanded] = useReducer((state, key) => {
    const newState = { ...state };
    if (state[key]) {
      newState[key] = false;
    } else {
      newState[key] = true;
    }
    return newState;
  }, {});

  const [selectedTasks, toggleSelectedTask] = useReducer((state, action) => {
    const newState = [].concat(state);
    const index = state.indexOf(action.payload);
    switch (action.type) {
      case 'add':
        newState.push(action.payload);
        break;
      case 'remove':
        newState.splice(index, 1);
        break;
    }

    return newState;
  }, plan.tasks.map(({ project_id, task_id }) => `${project_id}_-_${task_id}`));

  const handleToggleTask = (projectId, taskId) => {
    let endpoint = 'plan.addTask';
    let type = 'add';
    const params = {
      plan_id: plan.plan_id,
      project_id: projectId,
      task_id: taskId
    };

    const key = `${projectId}_-_${taskId}`;
    if (selectedTasks.indexOf(key) > -1) {
      endpoint = 'plan.removeTask';
      type = 'remove';
    }
    toggleSelectedTask({
      type,
      payload: key
    });
    request(endpoint, params);
  };

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
        {req.items.map(({ title, project_id }) => {
          const count = selectedTasks.filter(key => key.startsWith(project_id))
            .length;
          return (
            <Fragment key={project_id}>
              <SW.SectionHeader onClick={handleClickCached(project_id)}>
                {`${title}${count ? ` (${count})` : ''}`}
                <SW.Icon
                  icon="ArrowRightFull"
                  expanded={expanded[project_id]}
                />
              </SW.SectionHeader>
              {typeof expanded[project_id] !== 'undefined' && (
                <PlanProject
                  projectId={project_id}
                  selectedTasks={selectedTasks}
                  onToggleTask={editing ? undefined : handleToggleTask}
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
