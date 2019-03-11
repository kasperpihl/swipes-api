import React, { memo, useEffect, useState } from 'react';

import useSyncedProject from 'core/react/_hooks/useSyncedProject';
import useProjectSlice from 'core/react/_hooks/useProjectSlice';
import useProjectKeyboard from 'src/react/Project/useProjectKeyboard';
import useBeforeUnload from 'src/react/_hooks/useBeforeUnload';
import usePlanProjectSelect from 'src/react/Plan/usePlanProjectSelect';
import SectionHeader from '_shared/SectionHeader/SectionHeader';
import Button from '_shared/Button/Button';

import PlanTaskList from 'src/react/Plan/TaskList/PlanTaskList';

import SW from './PlanFilterProject.swiss';

export default memo(PlanFilterProject);

function PlanFilterProject({ projectId, project, dispatch, hasPending, plan }) {
  const stateManager = useSyncedProject(projectId, {
    filteredTaskIds: project.taskIds
  });

  const [selectable, setSelectable] = useState(false);
  const [selectedTasks, handleToggleTask] = usePlanProjectSelect(plan);

  useProjectKeyboard(stateManager);
  const [visibleOrder, completion, maxIndention] = useProjectSlice(
    stateManager,
    (clientState, localState) => [
      localState.get('visibleOrder'),
      clientState.get('completion'),
      localState.get('maxIndention')
    ]
  );

  useBeforeUnload(() => {
    stateManager && stateManager.syncHandler.syncIfNeeded();
  });

  useEffect(() => {
    if (completion) {
      const projectState = {
        stateManager,
        maxIndention,
        numberOfTasks: project.taskIds.length,
        numberOfCompleted: 0
      };
      project.taskIds.forEach(taskId => {
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
  }, [completion, project, maxIndention]);

  if (!visibleOrder || !stateManager || hasPending) {
    return (
      <SW.Wrapper>
        <SectionHeader>{project.title}</SectionHeader>
      </SW.Wrapper>
    );
  }

  const handleSelect = e => {
    e.preventDefault();

    stateManager.filterHandler.setFilteredTaskIds(null, project.taskIds);
    setSelectable(true);
  };

  return (
    <SW.Wrapper>
      <SectionHeader>
        {project.title}
        {selectable && (
          <Button
            title="Done"
            onClick={() => {
              stateManager.filterHandler.setFilteredTaskIds(project.taskIds);
              setSelectable(false);
            }}
          />
        )}
      </SectionHeader>
      <PlanTaskList
        stateManager={stateManager}
        selectable={selectable}
        onToggleTask={handleToggleTask}
        onInputClick={selectable ? undefined : handleSelect}
        selectedTasks={selectedTasks}
      />
    </SW.Wrapper>
  );
}
