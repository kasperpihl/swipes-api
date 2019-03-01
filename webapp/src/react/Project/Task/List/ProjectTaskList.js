import React, { useContext, memo } from 'react';
import ProjectTask from 'src/react/Project/Task/ProjectTask';
import useProjectSlice from 'core/react/_hooks/useProjectSlice';
import useProjectKeyboard from 'src/react/Project/useProjectKeyboard';
import { ProjectContext } from 'src/react/contexts';
import SW from './ProjectTaskList.swiss';

export default memo(ProjectTaskList);

function ProjectTaskList() {
  const stateManager = useContext(ProjectContext);
  useProjectKeyboard(stateManager);
  const [visibleOrder] = useProjectSlice(
    stateManager,
    (clientState, localState) => [localState.get('visibleOrder')]
  );

  return (
    <SW.Wrapper>
      {visibleOrder.map(taskId => (
        <ProjectTask key={taskId} taskId={taskId} />
      ))}
    </SW.Wrapper>
  );
}
