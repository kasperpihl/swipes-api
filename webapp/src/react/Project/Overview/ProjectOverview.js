import React from 'react';
import SW from './ProjectOverview.swiss';
// import withRequests from 'core/components/withRequests';

import Loader from 'src/react/_components/loaders/Loader';
import ProjectProvider from 'core/react/_hocs/Project/ProjectProvider';
import ProjectTask from 'src/react/Project/Task/ProjectTask';
import CardContent from 'src/react/_components/Card/Content/CardContent';
import CardHeader from 'src/react/_components/Card/Header/CardHeader';
import ProjectSide from 'src/react/Project/Side/ProjectSide';

import useSyncedProject from 'core/react/_hooks/useSyncedProject';
import useProjectKeyboard from 'src/react/Project/useProjectKeyboard';
import useProjectSlice from 'core/react/_hooks/useProjectSlice';

import useBeforeUnload from 'src/react/_hooks/useBeforeUnload';

ProjectOverview.sizes = [750];

export default function ProjectOverview({ projectId }) {
  const stateManager = useSyncedProject(projectId);

  useProjectKeyboard(stateManager);

  const [visibleOrder, projectName] = useProjectSlice(
    stateManager,
    (clientState, localState) => [
      localState.get('visibleOrder'),
      clientState.get('name')
    ]
  );

  useBeforeUnload(() => {
    stateManager && stateManager.syncHandler.syncIfNeeded();
  });

  if (!visibleOrder) {
    return <Loader center />;
  }

  return (
    <CardContent
      noframe
      header={<CardHeader padding={30} title={projectName} />}
    >
      <ProjectProvider stateManager={stateManager}>
        <SW.Wrapper>
          <ProjectSide stateManager={stateManager} />
          <SW.TasksWrapper>
            {visibleOrder.map(taskId => (
              <ProjectTask key={taskId} taskId={taskId} />
            ))}
          </SW.TasksWrapper>
        </SW.Wrapper>
      </ProjectProvider>
    </CardContent>
  );
}
