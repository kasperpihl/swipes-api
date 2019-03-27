import React, { useMemo, useReducer, useEffect, useRef } from 'react';
import Loader from 'src/react/_components/loaders/Loader';

import PlanningListProject from './Project/PlanningListProject';
import usePlanningState from 'src/react/Planning/usePlanningState';

import SW from './PlanningList.swiss';

export default function PlanningList({ tasks, ownedBy, yearWeek }) {
  const uniqueProjectIds = useMemo(
    () => [...new Set(tasks.map(({ project_id }) => project_id))],
    [tasks]
  );

  const didLoadInitial = useRef();

  const [projects, dispatch] = useReducer((state, action) => {
    switch (action.type) {
      case 'remove': {
        return { ...state, [action.projectId]: 'removed' };
      }
      case 'update':
        return { ...state, [action.projectId]: action.payload };
      default:
        return state;
    }
  }, {});

  const sortedProjectIds = useMemo(() => {
    return uniqueProjectIds
      .filter(id => projects[id] !== 'removed')
      .sort((a, b) => {
        const aP = projects[a];
        const bP = projects[b];
        if (!aP && !bP) return 0;
        if (aP && !bP) return -1;
        if (!aP && bP) return 1;
        return aP.title.localeCompare(bP.title);
      });
  }, [uniqueProjectIds, projects]);

  const [
    { numberOfCompleted, maxDepth, totalNumberOfTasks },
    updatePlanningState
  ] = usePlanningState();

  useEffect(() => {
    if (!didLoadInitial.current) {
      if (Object.keys(projects).length !== uniqueProjectIds.length) {
        return;
      }
      didLoadInitial.current = true;
    }
    let dCompleted = 0;
    let dDepth = 0;
    const stateManagers = [];

    Object.values(projects).forEach(p => {
      if (p === 'pending') return;
      if (p === 'removed') return;
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
  }, [projects, tasks]);

  return (
    <SW.Content didLoad={didLoadInitial.current}>
      {sortedProjectIds.map(project_id => (
        <PlanningListProject
          key={project_id}
          tasks={tasks}
          projectId={project_id}
          dispatch={dispatch}
          ownedBy={ownedBy}
          yearWeek={yearWeek}
        />
      ))}
    </SW.Content>
  );
}
