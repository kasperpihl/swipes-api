import React, { useContext } from 'react';
import { ProjectContext } from 'src/react/contexts';
import useProjectSlice from 'core/react/_hooks/useProjectSlice';
import ProjectTask from 'src/react/Project/Task/ProjectTask';

export default function ProjectTaskList({
  selectable,
  selectedTasks,
  onToggleTask,
  ...props
}) {
  const stateManager = useContext(ProjectContext);

  const [visibleOrder, indention, projectId] = useProjectSlice(
    stateManager,
    (clientState, localState) => [
      localState.get('visibleOrder'),
      clientState.get('indention'),
      clientState.get('project_id')
    ]
  );
  if (!visibleOrder) return null;

  if (!selectable) {
    // Filtered version
    return visibleOrder.map(taskId => (
      <ProjectTask taskId={taskId} key={taskId} {...props} />
    ));
  }

  // Selectable version
  let lastSelectedTaskId;
  let lastSelectedIndention = -1;

  return visibleOrder.map(taskId => {
    let isSelected = selectedTasks.indexOf(`${projectId}_-_${taskId}`) > -1;

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
      <ProjectTask
        key={taskId}
        taskId={taskId}
        selected={isSelected}
        onSelect={handlePlanSelect}
        {...props}
      />
    );
  });
}
