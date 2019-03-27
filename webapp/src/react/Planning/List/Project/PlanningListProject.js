import React, { memo, useEffect, useState, useMemo, useRef } from 'react';

import useSyncedProject from 'core/react/_hooks/useSyncedProject';
import useProjectSlice from 'core/react/_hooks/useProjectSlice';
import useProjectKeyboard from 'src/react/Project/useProjectKeyboard';
import useBeforeUnload from 'src/react/_hooks/useBeforeUnload';
import useTaskSelect from 'src/react/Planning/useTaskSelect';
import SectionHeader from '_shared/SectionHeader/SectionHeader';
import usePlanningState from 'src/react/Planning/usePlanningState';
import useNav from 'src/react/_hooks/useNav';
import { ProjectContext } from 'src/react/contexts';

import ProjectTaskList from 'src/react/Project/Task/List/ProjectTaskList';

import SW from './PlanningListProject.swiss';

export default memo(PlanningListProject);

function PlanningListProject({
  projectId,
  dispatch,
  tasks,
  ownedBy,
  yearWeek
}) {
  const nav = useNav();
  const filteredTaskIds = useMemo(
    () =>
      tasks
        .filter(({ project_id }) => project_id === projectId)
        .map(({ task_id }) => task_id),
    [tasks]
  );

  const taskIdsRef = useRef();
  const selectingRef = useRef();
  const stateManager = useSyncedProject(
    projectId,
    {
      filteredTaskIds
    },
    (err, res) => {
      if (err && err === 'Not found') {
        dispatch({
          type: 'remove',
          projectId
        });
      }
    }
  );

  useEffect(() => {
    taskIdsRef.current = filteredTaskIds;
    if (stateManager && !selectingRef.current) {
      stateManager.filterHandler.setFilteredTaskIds(filteredTaskIds);
    }
  }, [filteredTaskIds, stateManager]);

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
        title,
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

  const [{ editingId }, updatePlanningState] = usePlanningState();
  useEffect(() => {
    if (selectedId && editingId !== projectId) {
      updatePlanningState({ editingId: projectId });
    }
  }, [selectedId, editingId, projectId]);

  useEffect(() => {
    if (editingId === projectId && stateManager) {
      selectingRef.current = true;
      stateManager.filterHandler.setFilteredTaskIds(null, taskIdsRef.current);
      return () => {
        selectingRef.current = false;
        stateManager.filterHandler.setFilteredTaskIds(taskIdsRef.current);
      };
    }
  }, [editingId, stateManager]);

  if (!visibleOrder || !stateManager || !visibleOrder.size) {
    return null;
  }

  const handleOpenProject = () => {
    nav.openRight({
      screenId: 'ProjectOverview',
      crumbTitle: 'Project',
      props: {
        projectId
      }
    });
  };

  return (
    <ProjectContext.Provider value={stateManager}>
      <SW.Wrapper>
        <SectionHeader>
          <SW.Title onClick={handleOpenProject}>{title}</SW.Title>
        </SectionHeader>
        <ProjectTaskList
          selectable={editingId === projectId}
          onToggleTask={handleToggleTask}
          selectedTasks={selectedTasks}
        />
      </SW.Wrapper>
    </ProjectContext.Provider>
  );
}
