import React, { useCallback, useContext, memo } from 'react';
import SW from './ProjectTaskCheckbox.swiss';
import { connect } from 'react-redux';
import compose from 'src/utils/compose';
import Icon from 'src/react/_components/Icon/Icon';
import * as mainActions from 'src/redux/main/mainActions';
import useProjectSlice from 'core/react/_hooks/useProjectSlice';
import { ProjectContext } from 'src/react/contexts';

export default compose(
  connect(
    null,
    {
      successGradient: mainActions.successGradient
    }
  ),
  memo
)(ProjectTaskCheckbox);

function ProjectTaskCheckbox({ taskId, successGradient, disabled }) {
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
    },
    [completion]
  );

  return (
    <SW.Wrapper onClick={handleComplete} disabled={disabled}>
      <SW.Checkbox checked={completion}>
        {completion && <Icon icon="Checkmark" fill="#FFFFFF" width="18" />}
      </SW.Checkbox>
    </SW.Wrapper>
  );
}
