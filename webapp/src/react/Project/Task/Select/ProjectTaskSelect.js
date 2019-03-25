import React from 'react';
import SW from './ProjectTaskSelect.swiss';
import Icon from '_shared/Icon/Icon';

export default function ProjectTaskSelect({
  selected,
  onSelect,
  projectId,
  taskId
}) {
  return (
    <SW.Wrapper
      onClick={() =>
        onSelect({
          type: selected ? 'remove' : 'add',
          payload: `${projectId}_-_${taskId}`
        })
      }
    >
      <Icon icon={selected ? 'TaskRemove' : 'TaskAdd'} />
    </SW.Wrapper>
  );
}
