import React, { memo } from 'react';
import SW from './ProjectOverview.swiss';

import Loader from 'src/react/_components/loaders/Loader';
import CardContent from 'src/react/_components/Card/Content/CardContent';
import CardHeader from 'src/react/_components/Card/Header/CardHeader';

import ProjectSide from 'src/react/Project/Side/ProjectSide';
import ProjectTaskList from 'src/react/Project/Task/List/ProjectTaskList';

import useSyncedProject from 'core/react/_hooks/useSyncedProject';
import useProjectSlice from 'core/react/_hooks/useProjectSlice';
import useBeforeUnload from 'src/react/_hooks/useBeforeUnload';

import { ProjectContext } from 'src/react/contexts';

ProjectOverview.sizes = [750];

export default memo(ProjectOverview);

function ProjectOverview({ projectId }) {
  const stateManager = useSyncedProject(projectId);
  useBeforeUnload(() => {
    stateManager && stateManager.syncHandler.syncIfNeeded();
  });

  const [projectName] = useProjectSlice(stateManager, clientState => [
    clientState.get('name')
  ]);

  if (!projectName) {
    return <Loader center />;
  }

  return (
    <CardContent
      noframe
      header={<CardHeader padding={30} title={projectName} />}
    >
      <ProjectContext.Provider value={stateManager}>
        <SW.Wrapper>
          <ProjectSide stateManager={stateManager} />
          <ProjectTaskList />
        </SW.Wrapper>
      </ProjectContext.Provider>
    </CardContent>
  );
}
