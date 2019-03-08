import React, { memo } from 'react';
import Loader from 'src/react/_components/loaders/Loader';

import ProjectTask from 'src/react/Project/Task/ProjectTask';

import useSyncedProject from 'core/react/_hooks/useSyncedProject';
import useProjectSlice from 'core/react/_hooks/useProjectSlice';
import useProjectKeyboard from 'src/react/Project/useProjectKeyboard';
import useBeforeUnload from 'src/react/_hooks/useBeforeUnload';
import SectionHeader from 'src/react/_components/SectionHeader/SectionHeader';

import { ProjectContext } from 'src/react/contexts';

import SW from './PlanFilterProject.swiss';

export default memo(PlanFilterProject);

function PlanFilterProject({ projectId, project }) {
  const stateManager = useSyncedProject(projectId);

  useProjectKeyboard(stateManager);
  const [visibleOrder, indention] = useProjectSlice(
    stateManager,
    (clientState, localState) => [
      localState.get('visibleOrder'),
      clientState.get('indention')
    ]
  );

  useBeforeUnload(() => {
    stateManager && stateManager.syncHandler.syncIfNeeded();
  });

  if (!visibleOrder || !stateManager) {
    return (
      <SW.Wrapper>
        <SectionHeader>{project.title}</SectionHeader>
      </SW.Wrapper>
    );
  }

  return (
    <SW.Wrapper>
      <SectionHeader>{project.title}</SectionHeader>
      <ProjectContext.Provider value={stateManager}>
        {visibleOrder.map(taskId => {
          return <ProjectTask taskId={taskId} />;
        })}
      </ProjectContext.Provider>
    </SW.Wrapper>
  );
}
