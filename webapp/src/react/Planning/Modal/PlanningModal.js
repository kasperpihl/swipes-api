import React, { useState, useMemo } from 'react';
import PlanningModalProjectList from './Project/List/PlanningModalProjectList';
import PlanningModalProject from './Project/PlanningModalProject';
import useTaskSelect from 'src/react/Planning/useTaskSelect';
import Button from '_shared/Button/Button';
import SW from './PlanningModal.swiss';

export default function PlanningModal({
  yearWeek,
  ownedBy,
  hideModal,
  initialTasks
}) {
  const [[projectId, projectTitle], setProjectId] = useState([]);

  const [selectedTasks, handleToggleTask] = useTaskSelect(
    projectId,
    yearWeek,
    initialTasks
  );

  const count = useMemo(() => {
    if (!projectId) return null;
    return (
      selectedTasks.filter(id => id.split('_-_')[0] === projectId).length ||
      null
    );
  }, [selectedTasks, projectId]);

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
          selectedTasks={selectedTasks}
          onToggleTask={handleToggleTask}
        />
      )}
      <SW.BottomBar>
        <SW.TaskCounter>
          {count && `${count} task${count > 1 ? 's' : ''} selected`}
        </SW.TaskCounter>
        <Button title="Done" border onClick={hideModal} />
      </SW.BottomBar>
    </SW.Wrapper>
  );
}
