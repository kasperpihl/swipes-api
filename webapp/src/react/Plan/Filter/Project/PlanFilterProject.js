import React, { memo, useEffect } from 'react';
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

function PlanFilterProject({ projectId, project, dispatch, hasPending }) {
  const stateManager = useSyncedProject(projectId, {
    filteredTaskIds: project.taskIds
  });

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

  return (
    <SW.Wrapper>
      <SectionHeader>{project.title}</SectionHeader>
      <ProjectContext.Provider value={stateManager}>
        {visibleOrder.map(taskId => {
          return <ProjectTask taskId={taskId} key={taskId} />;
        })}
      </ProjectContext.Provider>
    </SW.Wrapper>
  );
}
