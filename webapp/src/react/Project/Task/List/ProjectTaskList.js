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
  return visibleOrder.map(taskId => {
    let isSelected = selectedTasks.indexOf(`${projectId}_-_${taskId}`) > -1;

    let handlePlanSelect = () => {
      onToggleTask(projectId, taskId);
    };

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
