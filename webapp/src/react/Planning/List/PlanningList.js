import React, { useMemo, useReducer } from 'react';

import PlanningListProject from './Project/PlanningListProject';

import SW from './PlanningList.swiss';

export default function PlanningList({ tasks }) {
  const initialState = useMemo(() => {
    const initialState = {};
    tasks.forEach(({ project_id }) => {
      initialState[project_id] = 'pending';
    });
    return initialState;
  }, []);

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

  const sortedProjectIds = useMemo(() => {
    if (hasPending) return Object.keys(projects);
    return Object.keys(projects).sort((a, b) =>
      planState[a].title.localeCompare(planState[b].title)
    );
  }, [hasPending]);

  console.log(planState, hasPending);

  return (
    <SW.Content>
      {sortedProjectIds.map(project_id => (
        <PlanningListProject
          key={project_id}
          projectId={project_id}
          hasPending={hasPending}
          dispatch={dispatch}
        />
      ))}
    </SW.Content>
  );
}
