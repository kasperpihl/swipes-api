import React, { memo, useState, useEffect, useCallback } from 'react';
import { ProjectContext } from 'src/react/contexts';
import { connect } from 'react-redux';

import Loader from 'src/react/_components/loaders/Loader';
import CardContent from 'src/react/_components/Card/Content/CardContent';
import CardHeader from 'src/react/_components/Card/Header/CardHeader';
import Button from 'src/react/_components/Button/Button';
import ListMenu from 'src/react/_components/ListMenu/ListMenu';
import FormModal from 'src/react/_components/FormModal/FormModal';
import Spacing from '_shared/Spacing/Spacing';
import InputToggle from '_shared/Input/Toggle/InputToggle';
import UserImage from '_shared/UserImage/UserImage';
import Stepper from '_shared/Stepper/Stepper';
import ActionBar from '_shared/ActionBar/ActionBar';

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
import useMyId from 'core/react/_hooks/useMyId';

import SW from './ProjectOverview.swiss';

ProjectOverview.sizes = [750];

export default connect(state => ({
  state
}))(memo(ProjectOverview));

function ProjectOverview({ projectId, state }) {
  const nav = useNav();
  const myId = useMyId();
  const stateManager = useSyncedProject(projectId);

  const [sliderValue, setSliderValue] = useState(1);
  const [showOnlyMe, setShowOnlyMe] = useState(false);
  const [hideCompleted, setHideCompleted] = useState(false);

  const [
    projectTitle,
    maxIndention,
    privacy,
    members,
    editing
  ] = useProjectSlice(stateManager, (clientState, localState) => [
    clientState.get('title'),
    localState.get('maxIndention'),
    clientState.get('privacy'),
    clientState.get('members'),
    localState.get('editing')
  ]);

  useRequest('project.mark', { project_id: projectId });

  useBeforeUnload(() => {
    stateManager && stateManager.syncHandler.syncIfNeeded();
  });

  useProjectKeyboard(stateManager);

  useEffect(() => {
    if (typeof maxIndention === 'number' && stateManager && maxIndention > 0) {
      setSliderValue(2);
      stateManager.expandHandler.setDepth(1);
    }
  }, [stateManager, typeof maxIndention === 'number']);

  useEffect(() => {
    if (sliderValue > maxIndention + 1) {
      setSliderValue(maxIndention + 1);
    }
  });

  const handleComplete = useCallback(
    (taskId, isCompleted) => {
      window.analytics.sendEvent(
        isCompleted ? 'Task completed' : 'Task incompleted',
        stateManager.getClientState().get('owned_by'),
        {
          From: 'Project'
        }
      );
    },
    [stateManager]
  );

  if (!projectTitle) {
    return <Loader center />;
  }

  let assignedMembers = [];
  if (!!members) {
    assignedMembers = Object.keys(members.toObject());
  }
  const subtitle = {
    ownedBy: stateManager.getClientState().get('owned_by'),
    members: privacy === 'public' ? null : assignedMembers,
    privacy,
    onClick: openAssignMenu
  };

  const openAssignMenu = e => {
    contextMenu(AssignMenu, e, {
      excludeMe: true,
      title: 'Add people',
      hideRowOnSelect: true,
      selectedIds: Object.keys(members),
      teamId: owned_by,
      onSelect: memberId => {
        request('project.addMember', {
          project_id: projectId,
          target_user_id: memberId
        });
      }
    });
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
    nav.openModal(FormModal, {
      title: 'Delete completed tasks',
      subtitle:
        'Are you sure you want to delete the completed tasks from this project? This cannot be undone.',
      onConfirm: callbackDeleteCompletedTasks,
      confirmLabel: 'Delete'
    });
  };

  const callbackDeleteCompletedTasks = () => {
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

  let actions = [];
  if (typeof stateManager !== 'undefined') {
    const handleHideCompleted = () => {
      stateManager.filterHandler.setFilteredCompleted(!hideCompleted);
      setHideCompleted(!hideCompleted);
    };

    const handleOnlyMe = () => {
      stateManager.filterHandler.setFilteredAssignee(showOnlyMe ? null : myId);
      setShowOnlyMe(!showOnlyMe);
    };

    actions.push(
      <>
        <SW.ToggleWrapper key="hidecompleted">
          <Button icon="CircledCheckmark" onClick={handleHideCompleted} />
          <InputToggle value={hideCompleted} onChange={handleHideCompleted} />
        </SW.ToggleWrapper>
        <SW.ToggleWrapper key="showMe">
          <Button onClick={handleOnlyMe}>
            <UserImage userId={myId} size={24} />
          </Button>
          <InputToggle value={showOnlyMe} onChange={handleOnlyMe} />
        </SW.ToggleWrapper>
      </>
    );

    const handleChange = number => {
      stateManager.expandHandler.setDepth(number - 1);
      setSliderValue(number);
    };
    actions.push(
      <Stepper
        key="stepper"
        value={sliderValue}
        onChange={handleChange}
        maxValue={maxIndention + 1}
      />
    );
  }
  if (editing) {
    // Editing!
    actions = [
      <Button
        key="done"
        title="Done editing"
        green
        icon="Checkmark"
        onClick={() => {
          stateManager.editHandler.doneEditing();
        }}
      />
    ];
  }

  return (
    <CardContent
      noframe
      header={
        <SW.HeaderWrapper>
          <CardHeader title={projectTitle} subtitle={subtitle} separator>
            <Button icon="ThreeDots" onClick={openContextMenu} />
          </CardHeader>
        </SW.HeaderWrapper>
      }
    >
      <ProjectContext.Provider value={stateManager}>
        <SW.Wrapper>
          <SW.LeftSide>
            <ProjectSide stateManager={stateManager} />
          </SW.LeftSide>
          <Spacing width={48} />
          <SW.RightSide>
            <SW.TaskWrapper>
              <ProjectTaskList onComplete={handleComplete} />
            </SW.TaskWrapper>
            <ActionBar actions={actions} green={editing} />
          </SW.RightSide>
        </SW.Wrapper>
      </ProjectContext.Provider>
    </CardContent>
  );
}
