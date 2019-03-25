import React, { useMemo, useReducer, useEffect } from 'react';
import Loader from 'src/react/_components/loaders/Loader';

import PlanningListProject from './Project/PlanningListProject';
import usePlanningState from 'src/react/Planning/usePlanningState';

import SW from './PlanningList.swiss';

export default function PlanningList({ tasks, ownedBy, yearWeek }) {
  const initialState = useMemo(() => {
    const initialState = {};
    tasks.forEach(({ project_id }) => {
      initialState[project_id] = 'pending';
    });
    return initialState;
  }, []);

  const [projects, dispatch] = useReducer((state, action) => {
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

  const hasPending = !!Object.entries(projects).filter(
    ([key, value]) => value === 'pending'
  ).length;

  const [
    { numberOfCompleted, maxDepth, totalNumberOfTasks },
    updatePlanningState
  ] = usePlanningState();
  useEffect(() => {
    if (hasPending) return;
    let dCompleted = 0;
    let dDepth = 0;
    const stateManagers = [];

    Object.values(projects).forEach(p => {
      if (p === 'pending') return;
      console.log(p);
      stateManagers.push(p.stateManager);
      dCompleted += p.numberOfCompleted;
      dDepth = Math.max(dDepth, p.maxIndention);
    });

    if (
      dCompleted !== numberOfCompleted ||
      dDepth !== maxDepth ||
      tasks.length !== totalNumberOfTasks
    ) {
      updatePlanningState({
        numberOfCompleted: dCompleted,
        maxDepth: dDepth,
        stateManagers,
        totalNumberOfTasks: tasks.length
      });
    }
  }, [hasPending, projects, tasks]);

  const sortedProjectIds = useMemo(() => {
    if (hasPending) return Object.keys(projects);
    return Object.keys(projects).sort((a, b) =>
      projects[a].title.localeCompare(projects[b].title)
    );
  }, [projects, hasPending]);

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
