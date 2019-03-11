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

  const [indention, isSelected, indentComp] = useProjectSlice(
    stateManager,
    (clientState, localState) => [
      clientState.getIn(['indention', taskId]),
      localState.get('selectedId') === taskId,
      localState.getIn(['indentComp', taskId]) || 0
    ]
  );

  if (typeof indention === 'undefined') return null;

  return (
    <SW.ProvideContext>
      <SW.Wrapper
        indention={indention - indentComp}
        selected={isSelected}
        isPlanSelected={selected}
      >
        <ProjectTaskExpand taskId={taskId} />
        <ProjectTaskCheckbox taskId={taskId} />
        <ProjectTaskInput taskId={taskId} onClick={onInputClick} />
        <ProjectTaskAssignees taskId={taskId} />
      </SW.Wrapper>
    </SW.ProvideContext>
  );
}
