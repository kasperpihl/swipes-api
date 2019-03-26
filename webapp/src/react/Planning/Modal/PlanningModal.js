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
    ownedBy,
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
        <SW.ButtonWrapper>
          {projectId && (
            <Button
              title="Change project"
              border
              onClick={() => setProjectId([])}
            />
          )}
          <Button title="Done" green onClick={hideModal} />
        </SW.ButtonWrapper>
      </SW.BottomBar>
    </SW.Wrapper>
  );
}
