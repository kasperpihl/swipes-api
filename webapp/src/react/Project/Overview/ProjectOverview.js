import React, { memo } from 'react';
import SW from './ProjectOverview.swiss';

import Loader from 'src/react/_components/loaders/Loader';
import CardContent from 'src/react/_components/Card/Content/CardContent';
import CardHeader from 'src/react/_components/Card/Header/CardHeader';
import Button from 'src/react/_components/Button/Button';
import ListMenu from 'src/react/_components/ListMenu/ListMenu';
import FormModal from 'src/react/_components/FormModal/FormModal';

import ProjectSide from 'src/react/Project/Side/ProjectSide';
import ProjectTaskList from 'src/react/Project/Task/List/ProjectTaskList';

import useNav from 'src/react/_hooks/useNav';
import request from 'core/utils/request';
import contextMenu from 'src/utils/contextMenu';
import useRequest from 'core/react/_hooks/useRequest';
import useProjectKeyboard from 'src/react/Project/useProjectKeyboard';

import useSyncedProject from 'core/react/_hooks/useSyncedProject';
import useProjectSlice from 'core/react/_hooks/useProjectSlice';
import useBeforeUnload from 'src/react/_hooks/useBeforeUnload';

import { ProjectContext } from 'src/react/contexts';

ProjectOverview.sizes = [750];

export default memo(ProjectOverview);

function ProjectOverview({ projectId }) {
  const nav = useNav();
  const stateManager = useSyncedProject(projectId);

  useProjectKeyboard(stateManager);

  useBeforeUnload(() => {
    stateManager && stateManager.syncHandler.syncIfNeeded();
  });

  const [projectTitle] = useProjectSlice(stateManager, clientState => [
    clientState.get('title')
  ]);
  useRequest('project.mark', { project_id: projectId });

  if (!projectTitle) {
    return <Loader center />;
  }

  const subtitle = {
    ownedBy: stateManager.getClientState().get('owned_by'),
    members: ['me'], // TODO: Wire up members for project header
    privacy: 'public'
  };

  const callbackDeleteProject = () => {
    request('project.delete', {
      project_id: projectId
    }).then(res => {
      if (res.ok) {
        nav.pop();
      }
    });
  };

  const handleDeleteProject = () => {
    nav.openModal(FormModal, {
      title: 'Delete project',
      subtitle: 'Are you sure you want to delete this project?',
      onConfirm: callbackDeleteProject,
      confirmLabel: 'Delete'
    });
  };

  const handleDeleteCompletedTasks = () => {
    stateManager.editHandler.deleteCompleted();
  };

  const handleClickProjectOption = (i, e) => {
    switch (e) {
      case 'Delete Project':
        handleDeleteProject();
        break;
      case 'Delete Completed Tasks':
        handleDeleteCompletedTasks();
        break;
      default:
        return;
    }
  };

  const openContextMenu = e => {
    contextMenu(ListMenu, e, {
      onClick: handleClickProjectOption,
      buttons: ['Delete Project', 'Delete Completed Tasks']
    });
  };

  return (
    <CardContent
      noframe
      header={
        <CardHeader
          padding={18}
          title={projectTitle}
          subtitle={subtitle}
          separator
        >
          <Button icon="ThreeDots" onClick={openContextMenu} />
        </CardHeader>
      }
    >
      <ProjectContext.Provider value={stateManager}>
        <SW.Wrapper>
          <ProjectSide stateManager={stateManager} />
          <SW.TaskWrapper>
            <ProjectTaskList />
          </SW.TaskWrapper>
        </SW.Wrapper>
      </ProjectContext.Provider>
    </CardContent>
  );
}
