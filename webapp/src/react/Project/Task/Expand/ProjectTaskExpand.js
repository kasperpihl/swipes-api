import React, { useCallback, useContext, memo } from 'react';

import useProjectSlice from 'core/react/_hooks/useProjectSlice';
import { ProjectContext } from 'src/react/contexts';

import SW from './ProjectTaskExpand.swiss';

export default memo(ProjectTaskExpand);

function ProjectTaskExpand({ taskId }) {
  const stateManager = useContext(ProjectContext);
  const [expanded, hasChildren] = useProjectSlice(
    stateManager,
    (clientState, localState) => [
      localState.getIn(['expanded', taskId]),
      localState.getIn(['hasChildren', taskId])
    ]
  );

  const handleExpandClick = useCallback(
    e => {
      e.stopPropagation();
      stateManager.expandHandler[expanded ? 'collapse' : 'expand'](taskId);
    },
    [expanded]
  );

  return (
    <SW.Wrapper onClick={handleExpandClick}>
      {hasChildren && <SW.ExpandIcon icon="ArrowRight" expanded={expanded} />}
    </SW.Wrapper>
  );
}
