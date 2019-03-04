import React, { useContext, memo } from 'react';

import { ProjectContext } from 'src/react/contexts';
import useProjectSlice from 'core/react/_hooks/useProjectSlice';

import ProjectTaskExpand from './Expand/ProjectTaskExpand';
import ProjectTaskCheckbox from './Checkbox/ProjectTaskCheckbox';
import ProjectTaskInput from './Input/ProjectTaskInput';
import ProjectTaskAssignees from './Assignees/ProjectTaskAssignees';

import SW from './ProjectTask.swiss';

export default memo(ProjectTask);

function ProjectTask({ taskId, isSelectedInPlan, onPlanSelect }) {
  const stateManager = useContext(ProjectContext);

  const [indention, isSelected] = useProjectSlice(
    stateManager,
    (clientState, localState) => [
      clientState.getIn(['indention', taskId]),
      localState.get('selectedId') === taskId
    ]
  );

  if (typeof indention === 'undefined') return null;

  return (
    <SW.ProvideContext>
      <SW.Wrapper
        onClick={onPlanSelect}
        indention={indention}
        selectedInPlan={isSelectedInPlan}
        selected={isSelected}
      >
        <ProjectTaskExpand taskId={taskId} />
        <ProjectTaskCheckbox taskId={taskId} disabled={!!onPlanSelect} />
        <ProjectTaskInput taskId={taskId} disabled={!!onPlanSelect} />
        <ProjectTaskAssignees taskId={taskId} />
      </SW.Wrapper>
    </SW.ProvideContext>
  );
}
