import React, { useCallback, useContext, memo } from 'react';
import { fromJS } from 'immutable';
import AssignMenu from 'src/react/_components/AssignMenu/AssignMenu';
import Assignees from 'src/react/_components/Assignees/Assignees';
import Button from 'src/react/_components/Button/Button';
import contextMenu from 'src/utils/contextMenu';
import useProjectSlice from 'core/react/_hooks/useProjectSlice';
import { ProjectContext } from 'src/react/contexts';
import useMyId from 'core/react/_hooks/useMyId';

import SW from './ProjectTaskAssignees.swiss';

export default memo(ProjectTaskAssignees);
function ProjectTaskAssignees({ taskId }) {
  const myId = useMyId();
  const stateManager = useContext(ProjectContext);

  const [assignees, ownedBy, isSelected] = useProjectSlice(
    stateManager,
    (clientState, localState) => [
      clientState.getIn(['tasks_by_id', taskId, 'assignees']),
      clientState.get('owned_by'),
      localState.get('selectedId') === taskId
    ]
  );

  const handleAssigneeSelect = useCallback(newAssignees => {
    console.log(newAssignees);
    stateManager.editHandler.updateAssignees(taskId, fromJS(newAssignees));
  });

  const handleAssignClick = useCallback(
    e => {
      contextMenu(AssignMenu, e, {
        excludeMe: false,
        selectedIds: assignees,
        teamId: stateManager.getClientState().get('owned_by'),
        onClose: handleAssigneeSelect
      });
    },
    [assignees]
  );
  let assigneesCount = fromJS([]);
  if (assignees) {
    assigneesCount = assignees;
  }

  return (
    <SW.Wrapper
      hide={!assigneesCount.size && !isSelected}
      onClick={assigneesCount.size ? handleAssignClick : undefined}
    >
      <Assignees
        userIds={assigneesCount}
        teamId={ownedBy}
        size={22}
        maxImages={4}
        onClick={handleAssignClick}
      >
        <Button
          icon="Person"
          onClick={() => handleAssigneeSelect([myId])}
          small
        />
      </Assignees>
    </SW.Wrapper>
  );
}
