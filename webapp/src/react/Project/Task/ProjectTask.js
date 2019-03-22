import React, { useContext, memo } from 'react';

import { ProjectContext } from 'src/react/contexts';
import useProjectSlice from 'core/react/_hooks/useProjectSlice';

import ProjectTaskExpand from './Expand/ProjectTaskExpand';
import ProjectTaskCheckbox from './Checkbox/ProjectTaskCheckbox';
import ProjectTaskInput from './Input/ProjectTaskInput';
import ProjectTaskAssignees from './Assignees/ProjectTaskAssignees';

import SW from './ProjectTask.swiss';

export default memo(ProjectTask);

function ProjectTask({ taskId, selected, onInputClick }) {
  const stateManager = useContext(ProjectContext);

  const [indention, isSelected, indentComp, completion] = useProjectSlice(
    stateManager,
    (clientState, localState) => [
      clientState.getIn(['indention', taskId]),
      localState.get('selectedId') === taskId,
      localState.getIn(['indentComp', taskId]) || 0,
      clientState.getIn(['completion', taskId])
    ]
  );

  if (typeof indention === 'undefined') return null;

  return (
    <SW.Wrapper
      indention={indention - indentComp}
      selected={isSelected}
      isPlanSelected={selected}
    >
      <ProjectTaskExpand taskId={taskId} />
      <ProjectTaskCheckbox taskId={taskId} />
      <ProjectTaskInput
        taskId={taskId}
        onClick={onInputClick}
        isCompleted={completion}
      />
      <ProjectTaskAssignees taskId={taskId} />
    </SW.Wrapper>
  );
}
