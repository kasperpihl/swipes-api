import React, { useMemo, useReducer } from 'react';
import Loader from 'src/react/_components/loaders/Loader';

import PlanningListProject from './Project/PlanningListProject';

import SW from './PlanningList.swiss';

export default function PlanningList({ tasks, ownedBy, yearWeek }) {
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
    if (hasPending) return Object.keys(planState);
    return Object.keys(planState).sort((a, b) =>
      planState[a].title.localeCompare(planState[b].title)
    );
  }, [planState, hasPending]);

  return (
    <SW.Content>
      {hasPending && <Loader center mini size={24} />}
      {sortedProjectIds.map(project_id => (
        <PlanningListProject
          key={project_id}
          tasks={tasks}
          projectId={project_id}
          hasPending={hasPending}
          dispatch={dispatch}
          ownedBy={ownedBy}
          yearWeek={yearWeek}
        />
      ))}
    </SW.Content>
  );
}
