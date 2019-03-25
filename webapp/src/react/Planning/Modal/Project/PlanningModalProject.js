import React, { memo, useEffect, useState } from 'react';
import Loader from 'src/react/_components/loaders/Loader';
import PlanTaskList from 'src/react/Plan/TaskList/PlanTaskList';
import useSyncedProject from 'core/react/_hooks/useSyncedProject';
import useProjectKeyboard from 'src/react/Project/useProjectKeyboard';
import useBeforeUnload from 'src/react/_hooks/useBeforeUnload';

import SW from './PlanningModalProject.swiss';

export default function PlanningModalProject({
  projectId,
  selectedTasks,
  onToggleTask
}) {
  const stateManager = useSyncedProject(projectId);
  const [didEnforce, setDidEnforce] = useState(false);

  useProjectKeyboard(stateManager);

  useBeforeUnload(() => {
    stateManager && stateManager.syncHandler.syncIfNeeded();
  });

  useEffect(() => {
    if (stateManager) {
      stateManager.filterHandler.setFilteredTaskIds(
        null,
        selectedTasks.map(id => id.split('_-_')[1])
      );
      setDidEnforce(true);
    }
  }, [stateManager]);

  if (!stateManager || !didEnforce) {
    return (
      <SW.LoaderWrapper>
        <Loader mini size={36} />
      </SW.LoaderWrapper>
    );
  }

  return (
    <SW.Wrapper>
      <PlanTaskList
        stateManager={stateManager}
        selectable
        onToggleTask={onToggleTask}
        selectedTasks={selectedTasks}
      />
    </SW.Wrapper>
  );
}
