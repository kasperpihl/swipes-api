import React, { useState, useEffect, memo } from 'react';
import useProjectSlice from 'core/react/_hooks/useProjectSlice';
import contextMenu from 'src/utils/contextMenu';
import successGradient from 'src/utils/successGradient';
import request from 'core/utils/request';

import AssignMenu from '_shared/AssignMenu/AssignMenu';
import SideHeader from '_shared/SideHeader/SideHeader';
import ProgressBar from '_shared/ProgressBar/ProgressBar';
import Spacing from '_shared/Spacing/Spacing';

import SW from './ProjectSide.swiss';

export default memo(ProjectSide);

function ProjectSide({ stateManager }) {
  const [
    numberOfCompleted,
    numberOfLeafs,
    members,
    ownedBy,
    projectId
  ] = useProjectSlice(stateManager, (clientState, localState) => [
    localState.get('numberOfCompleted'),
    localState.get('numberOfLeafs'),
    clientState.get('members'),
    clientState.get('owned_by'),
    clientState.get('project_id')
  ]);

  const completionPercentage = Math.ceil(
    (numberOfCompleted / numberOfLeafs) * 100
  );

  const openAssignMenu = e => {
    const assignedMembers = members.toObject();
    contextMenu(AssignMenu, e, {
      excludeMe: true,
      hideRowOnSelect: true,
      selectedIds: Object.keys(assignedMembers),
      teamId: ownedBy,
      onSelect: id => {
        request('project.addMember', {
          project_id: projectId,
          target_user_id: id
        });
      }
    });
  };

  const handleCompleteAll = () => {
    if (completionPercentage < 100) {
      successGradient('green');
    }
    stateManager.completeHandler.completeAll(completionPercentage < 100);
  };

  const isPublic = stateManager.getClientState().get('privacy') === 'public';

  return (
    <SW.Wrapper>
      <SideHeader
        largeNumber={numberOfCompleted}
        smallNumber={`/ ${numberOfLeafs}`}
        subtitle="Tasks"
      />
      <Spacing height={18} />
      <ProgressBar progress={completionPercentage} />
      <SW.ButtonWrapper>
        <SW.Button
          title={
            completionPercentage === 100 ? 'Redo project' : 'Complete project'
          }
          icon="Complete"
          onClick={handleCompleteAll}
        />
        {!isPublic && (
          <SW.Button
            title="Add people"
            icon="Person"
            onClick={openAssignMenu}
          />
        )}
      </SW.ButtonWrapper>
      <Spacing height={6} />
    </SW.Wrapper>
  );
}
