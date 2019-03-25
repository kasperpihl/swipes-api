import React, { useEffect, useState } from 'react';
import Loader from 'src/react/_components/loaders/Loader';
import Spacing from '_shared/Spacing/Spacing';
import useSyncedProject from 'core/react/_hooks/useSyncedProject';
import ProjectTaskList from 'src/react/Project/Task/List/ProjectTaskList';
import useProjectKeyboard from 'src/react/Project/useProjectKeyboard';
import useSyncedProject from 'core/react/_hooks/useSyncedProject';
import useBeforeUnload from 'src/react/_hooks/useBeforeUnload';
import { ProjectContext } from 'src/react/contexts';

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
    <ProjectContext.Provider value={stateManager}>
      <SW.Wrapper>
        <Spacing height={6} />
        <ProjectTaskList
          selectable
          onToggleTask={onToggleTask}
          selectedTasks={selectedTasks}
        />
      </SW.Wrapper>
    </ProjectContext.Provider>
  );
}
