import React, { useMemo, useReducer } from 'react';

import PlanFilterProject from './Project/PlanFilterProject';
import PlanSideRunning from 'src/react/Plan/Side/Running/PlanSideRunning';

import SW from './PlanFilter.swiss';

export default function PlanFilter({ plan }) {
  const projects = useMemo(() => {
    const projects = {};
    plan.tasks.forEach(({ project_id, title, task_id }) => {
      if (!projects[project_id]) {
        projects[project_id] = {
          title,
          taskIds: []
        };
      }
      projects[project_id].taskIds.push(task_id);
    });

    return projects;
  }, [plan]);

  const sortedProjectIds = useMemo(
    () =>
      Object.keys(projects).sort((a, b) =>
        projects[a].title.localeCompare(projects[b].title)
      ),
    [projects]
  );

  const initialState = useMemo(() => {
    const initialState = {};
    sortedProjectIds.forEach(pId => {
      initialState[pId] = 'pending';
    });
    return initialState;
  }, [sortedProjectIds]);

  const [planState, dispatch] = useReducer((state, action) => {
    switch (action.type) {
      case 'update':
        return {
          ...state,
          [action.projectId]: action.payload
        };
      default:
        return state;
    }
  }, initialState);
  const hasPending = !!Object.entries(planState).filter(
    ([key, value]) => value === 'pending'
  ).length;

  console.log(planState, hasPending);

  return (
    <SW.Wrapper>
      <PlanSideRunning
        plan={plan}
        planState={planState}
        hasPending={hasPending}
      />
      <SW.Content>
        {sortedProjectIds.map(project_id => (
          <PlanFilterProject
            key={project_id}
            projectId={project_id}
            project={projects[project_id]}
            hasPending={hasPending}
            dispatch={dispatch}
          />
        ))}
      </SW.Content>
    </SW.Wrapper>
  );
}
