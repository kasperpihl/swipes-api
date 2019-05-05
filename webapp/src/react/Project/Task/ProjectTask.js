import React, { useContext, memo } from 'react';
import { ProjectContext } from 'src/react/contexts';
import useProjectSlice from 'core/react/_hooks/useProjectSlice';

import ProjectTaskExpand from './Expand/ProjectTaskExpand';
import ProjectTaskCheckbox from './Checkbox/ProjectTaskCheckbox';
import ProjectTaskSelect from './Select/ProjectTaskSelect';
import ProjectTaskInput from './Input/ProjectTaskInput';
import ProjectTaskAssignees from './Assignees/ProjectTaskAssignees';
import ProjectTaskAttach from './Attach/ProjectTaskAttach';
import Button from '_shared/Button/Button';
import AttachmentHOC from '_shared/Attachment/AttachmentHOC';

import SW from './ProjectTask.swiss';

export default memo(ProjectTask);

function ProjectTask({ taskId, selected, onSelect, onComplete }) {
  const stateManager = useContext(ProjectContext);

  const [
    indention,
    isFocused,
    indentComp,
    isCompleted,
    projectId,
    attachment
  ] = useProjectSlice(stateManager, (clientState, localState) => [
    clientState.getIn(['indention', taskId]),
    localState.get('selectedId') === taskId,
    localState.getIn(['indentComp', taskId]) || 0, // Indent compensation for filters
    clientState.getIn(['completion', taskId]),
    clientState.get('project_id'),
    clientState.getIn(['tasks_by_id', taskId, 'attachment'])
  ]);

  if (typeof indention === 'undefined') return null;

  if (attachment) {
    const handleEdit = e => {
      e.preventDefault();
      e.stopPropagation();
      stateManager.selectHandler.select(taskId);
    };
    return (
      <AttachmentHOC attachment={attachment.toJS()}>
        {(icon, onClick) => (
          <SW.Wrapper
            indention={indention - indentComp}
            isFocused={isFocused}
            onClick={onClick}
          >
            <ProjectTaskExpand taskId={taskId} />
            <SW.Icon icon={icon} />
            <ProjectTaskInput taskId={taskId} isAttachment />
            <SW.ButtonWrapper>
              <Button icon="ThreeDots" onClick={handleEdit} small />
            </SW.ButtonWrapper>
          </SW.Wrapper>
        )}
      </AttachmentHOC>
    );
  }

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
      <ProjectTaskAttach taskId={taskId} />
      <ProjectTaskAssignees taskId={taskId} />
    </SW.Wrapper>
  );
}
