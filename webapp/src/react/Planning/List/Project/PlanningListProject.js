import React, { memo, useEffect, useState, useMemo, useRef } from 'react';

import useSyncedProject from 'core/react/_hooks/useSyncedProject';
import useProjectSlice from 'core/react/_hooks/useProjectSlice';
import useProjectKeyboard from 'src/react/Project/useProjectKeyboard';
import useBeforeUnload from 'src/react/_hooks/useBeforeUnload';
import useTaskSelect from 'src/react/Planning/useTaskSelect';
import SectionHeader from '_shared/SectionHeader/SectionHeader';
import Button from '_shared/Button/Button';
import Spacing from '_shared/Spacing/Spacing';
import { ProjectContext } from 'src/react/contexts';

import ProjectTaskList from 'src/react/Project/Task/List/ProjectTaskList';

import SW from './PlanningListProject.swiss';

export default memo(PlanningListProject);

function PlanningListProject({
  projectId,
  dispatch,
  tasks,
  hasPending,
  ownedBy,
  yearWeek
}) {
  const filteredTaskIds = useMemo(
    () =>
      tasks
        .filter(({ project_id }) => project_id === projectId)
        .map(({ task_id }) => task_id),
    [tasks]
  );

  const stateManager = useSyncedProject(projectId, {
    filteredTaskIds
  });

  useMemo(() => {
    if (stateManager) {
      stateManager.filterHandler.setFilteredTaskIds(filteredTaskIds);
    }
  }, [filteredTaskIds, stateManager]);

  const [selectable, setSelectable] = useState(false);
  const [selectedTasks, handleToggleTask] = useTaskSelect(
    ownedBy,
    projectId,
    yearWeek,
    tasks
  );

  useProjectKeyboard(stateManager);

  const [
    visibleOrder,
    completion,
    maxIndention,
    title,
    selectedId
  ] = useProjectSlice(stateManager, (clientState, localState) => [
    localState.get('visibleOrder'),
    clientState.get('completion'),
    localState.get('maxIndention'),
    clientState.get('title'),
    localState.get('selectedId')
  ]);

  useBeforeUnload(() => {
    stateManager && stateManager.syncHandler.syncIfNeeded();
  });

  useEffect(() => {
    if (completion) {
      const projectState = {
        stateManager,
        maxIndention,
        numberOfTasks: filteredTaskIds.length,
        numberOfCompleted: 0
      };
      filteredTaskIds.forEach(taskId => {
        if (completion.get(taskId)) {
          projectState.numberOfCompleted++;
        }
      });
      dispatch({
        type: 'update',
        projectId,
        payload: projectState
      });
    }
  }, [completion, filteredTaskIds, maxIndention]);

  const hasSelectedRef = useRef(!!selectedId);
  useEffect(() => {
    if (selectedId && stateManager) {
      hasSelectedRef.current = true;
      stateManager.filterHandler.setFilteredTaskIds(null, filteredTaskIds);
      setSelectable(true);
    } else if (stateManager) {
      hasSelectedRef.current = false;
      setTimeout(() => {
        if (!hasSelectedRef.current) {
          stateManager.filterHandler.setFilteredTaskIds(filteredTaskIds);
          setSelectable(false);
        }
      }, 100);
    }
  }, [!!selectedId, stateManager]);

  if (!visibleOrder || !stateManager || hasPending) {
    return null;
  }

  return (
    <ProjectContext.Provider value={stateManager}>
      <SW.Wrapper>
        <SectionHeader>{title}</SectionHeader>
        <ProjectTaskList
          selectable={selectable}
          onToggleTask={handleToggleTask}
          selectedTasks={selectedTasks}
        />
      </SW.Wrapper>
    </ProjectContext.Provider>
  );
}
