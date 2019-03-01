import React, { memo } from 'react';
import useSyncedProject from 'core/react/_hooks/useSyncedProject';
import Loader from 'src/react/_components/loaders/Loader';

import ProjectTaskList from 'src/react/Project/Task/List/ProjectTaskList';

import useBeforeUnload from 'src/react/_hooks/useBeforeUnload';
import { ProjectContext } from 'src/react/contexts';

import SW from './PlanProject.swiss';

export default memo(PlanProject);
function PlanProject({ projectId }) {
  const stateManager = useSyncedProject(projectId);

  useBeforeUnload(() => {
    stateManager && stateManager.syncHandler.syncIfNeeded();
  });

  if (!stateManager) {
    return (
      <SW.LoaderWrapper>
        <Loader mini size={24} />
      </SW.LoaderWrapper>
    );
  }

  return (
    <ProjectContext.Provider value={stateManager}>
      <ProjectTaskList />
    </ProjectContext.Provider>
  );
}
