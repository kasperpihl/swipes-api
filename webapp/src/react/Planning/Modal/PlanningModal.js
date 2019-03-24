import React, { useState } from 'react';
import PlanningModalProjectList from './Project/List/PlanningModalProjectList';
import PlanningModalProject from './Project/PlanningModalProject';
import Button from '_shared/Button/Button';
import SW from './PlanningModal.swiss';

export default function PlanningModal({ yearWeek, ownedBy, hideModal }) {
  const [[projectId, projectTitle], setProjectId] = useState([]);
  return (
    <SW.Wrapper>
      <SW.TopBar>
        {projectId && (
          <Button icon="ArrowLeft" onClick={() => setProjectId([])} />
        )}
        <SW.Title>{projectId ? projectTitle : 'Choose a project'}</SW.Title>
      </SW.TopBar>
      <PlanningModalProjectList
        setProjectId={setProjectId}
        projectId={projectId}
        ownedBy={ownedBy}
      />
      {projectId && (
        <PlanningModalProject
          setProjectId={setProjectId}
          projectId={projectId}
          ownedBy={ownedBy}
          yearWeek={yearWeek}
        />
      )}
      <SW.BottomBar>
        <SW.TaskCounter>{projectId && '3 tasks selected'}</SW.TaskCounter>
        <Button title="Done" border onClick={hideModal} />
      </SW.BottomBar>
    </SW.Wrapper>
  );
}
