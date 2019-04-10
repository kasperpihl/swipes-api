import React, { useCallback, useContext, memo } from 'react';
import SW from './ProjectTaskCheckbox.swiss';
import Icon from 'src/react/_components/Icon/Icon';
import successGradient from 'src/utils/successGradient';

import useProjectSlice from 'core/react/_hooks/useProjectSlice';
import { ProjectContext } from 'src/react/contexts';

export default memo(ProjectTaskCheckbox);

function ProjectTaskCheckbox({ taskId, onComplete }) {
  const stateManager = useContext(ProjectContext);
  const [completion] = useProjectSlice(stateManager, clientState => [
    clientState.getIn(['completion', taskId])
  ]);

  const handleComplete = useCallback(
    e => {
      if (completion) {
        stateManager.completeHandler.incomplete(taskId);
      } else {
        stateManager.completeHandler.complete(taskId);
        successGradient('green');
      }
      if (typeof onComplete === 'function') {
        onComplete(taskId, !completion);
      }
    },
    [completion]
  );

  return (
    <SW.Wrapper onClick={handleComplete}>
      <SW.Checkbox checked={completion}>
        {completion && <Icon icon="Checkmark" fill="#FFFFFF" width="18" />}
      </SW.Checkbox>
    </SW.Wrapper>
  );
}
