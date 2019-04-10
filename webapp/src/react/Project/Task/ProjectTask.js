import React, { useContext, memo } from 'react';

import { ProjectContext } from 'src/react/contexts';
import useProjectSlice from 'core/react/_hooks/useProjectSlice';

import ProjectTaskExpand from './Expand/ProjectTaskExpand';
import ProjectTaskCheckbox from './Checkbox/ProjectTaskCheckbox';
import ProjectTaskSelect from './Select/ProjectTaskSelect';
import ProjectTaskInput from './Input/ProjectTaskInput';
import ProjectTaskAssignees from './Assignees/ProjectTaskAssignees';

import SW from './ProjectTask.swiss';

export default memo(ProjectTask);

function ProjectTask({ taskId, selected, onSelect, onComplete }) {
  const stateManager = useContext(ProjectContext);

  const [
    indention,
    isFocused,
    indentComp,
    isCompleted,
    projectId
  ] = useProjectSlice(stateManager, (clientState, localState) => [
    clientState.getIn(['indention', taskId]),
    localState.get('selectedId') === taskId,
    localState.getIn(['indentComp', taskId]) || 0, // Indent compensation for filters
    clientState.getIn(['completion', taskId]),
    clientState.get('project_id')
  ]);

  if (typeof indention === 'undefined') return null;

  return (
    <SW.Wrapper
      indention={indention - indentComp}
      isFocused={isFocused}
      isSelected={selected}
    >
      <ProjectTaskExpand taskId={taskId} />
      {(isCompleted || !onSelect) && (
        <ProjectTaskCheckbox taskId={taskId} onComplete={onComplete} />
      )}
      {!isCompleted && onSelect && (
        <ProjectTaskSelect
          onSelect={onSelect}
          selected={selected}
          projectId={projectId}
          taskId={taskId}
        />
      )}
      <ProjectTaskInput taskId={taskId} isCompleted={isCompleted} />
      <ProjectTaskAssignees taskId={taskId} />
    </SW.Wrapper>
  );
}
