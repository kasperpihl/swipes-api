import React from 'react';
import { ProjectContext } from 'src/react/contexts';
import useProjectSlice from 'core/react/_hooks/useProjectSlice';
import ProjectTask from 'src/react/Project/Task/ProjectTask';

import SW from './PlanTaskList.swiss';

export default function PlanTaskList({
  selectable,
  stateManager,
  selectedTasks,
  onToggleTask,
  onInputClick
}) {
  const [visibleOrder, indention, projectId] = useProjectSlice(
    stateManager,
    (clientState, localState) => [
      localState.get('visibleOrder'),
      clientState.get('indention'),
      clientState.get('project_id')
    ]
  );
  if (!visibleOrder) return null;

  if (selectable) {
    // Selectable version
    let lastSelectedTaskId;
    let lastSelectedIndention = -1;

    return (
      <ProjectContext.Provider value={stateManager}>
        {visibleOrder.map(taskId => {
          let isSelected =
            selectedTasks.indexOf(`${projectId}_-_${taskId}`) > -1;

          if (isSelected) {
            lastSelectedTaskId = taskId;
            lastSelectedIndention = indention.get(taskId);
          }

          if (!isSelected && lastSelectedTaskId) {
            isSelected = indention.get(taskId) > lastSelectedIndention;
            if (!isSelected) {
              lastSelectedTaskId = null;
              lastSelectedIndention = -1;
            }
          }

          let handlePlanSelect;
          if (!isSelected || taskId === lastSelectedTaskId) {
            handlePlanSelect = () => {
              onToggleTask(projectId, taskId);
            };
          }
          return (
            <SW.TaskWrapper key={taskId}>
              <SW.ButtonWrapper forceHide={!handlePlanSelect}>
                <SW.Button
                  icon="Plus"
                  onClick={handlePlanSelect}
                  selected={isSelected}
                  small
                />
              </SW.ButtonWrapper>
              <ProjectTask taskId={taskId} selected={isSelected} />
            </SW.TaskWrapper>
          );
        })}
      </ProjectContext.Provider>
    );
  }
  // Filtered version
  return (
    <ProjectContext.Provider value={stateManager}>
      {visibleOrder.map(taskId => (
        <ProjectTask taskId={taskId} key={taskId} onInputClick={onInputClick} />
      ))}
    </ProjectContext.Provider>
  );
}
