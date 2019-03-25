import React from 'react';
import SW from './ProjectTaskSelect.swiss';

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
      {selected ? '-' : '+'}
    </SW.Wrapper>
  );
}
