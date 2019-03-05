import React, { memo } from 'react';
import Loader from 'src/react/_components/loaders/Loader';

import ProjectTask from 'src/react/Project/Task/ProjectTask';

import useSyncedProject from 'core/react/_hooks/useSyncedProject';
import useProjectSlice from 'core/react/_hooks/useProjectSlice';
import useProjectKeyboard from 'src/react/Project/useProjectKeyboard';
import useBeforeUnload from 'src/react/_hooks/useBeforeUnload';

import { ProjectContext } from 'src/react/contexts';

import SW from './PlanProject.swiss';

export default memo(PlanProject);
function PlanProject({ projectId, hidden, selectedTasks, onToggleTask }) {
  const stateManager = useSyncedProject(projectId);

  useProjectKeyboard(stateManager);
  const [visibleOrder, indention] = useProjectSlice(
    stateManager,
    (clientState, localState) => [
      localState.get('visibleOrder'),
      clientState.get('indention')
    ]
  );

  useBeforeUnload(() => {
    stateManager && stateManager.syncHandler.syncIfNeeded();
  });

  if (!visibleOrder || !stateManager) {
    if (hidden) return null;
    return (
      <SW.LoaderWrapper>
        <Loader mini size={24} />
      </SW.LoaderWrapper>
    );
  }

  let lastSelectedTaskId;
  let lastSelectedIndention = -1;

  return (
    <SW.Wrapper hidden={hidden}>
      <ProjectContext.Provider value={stateManager}>
        {visibleOrder.map(taskId => {
          let isSelected =
            selectedTasks.indexOf(`${projectId}_-_${taskId}`) > -1;

          if (isSelected) {
            lastSelectedTaskId = taskId;
            lastSelectedIndention = indention.get(taskId);
          }

          if (!isSelected && lastSelectedTaskId) {
            isSelected = indention.get(taskId) > lastSelectedIndention;
            if (!isSelected) {
              lastSelectedTaskId = null;
              lastSelectedIndention = -1;
            }
          }

          let handlePlanSelect;
          if (!isSelected || taskId === lastSelectedTaskId) {
            handlePlanSelect = () => {
              onToggleTask(projectId, taskId);
            };
          }

          return (
            <SW.TaskWrapper key={taskId}>
              <SW.ButtonWrapper forceHide={!handlePlanSelect}>
                <SW.Button
                  icon="Plus"
                  onClick={handlePlanSelect}
                  selected={isSelected}
                  small
                />
              </SW.ButtonWrapper>
              <ProjectTask taskId={taskId} selected={isSelected} />
            </SW.TaskWrapper>
          );
        })}
      </ProjectContext.Provider>
    </SW.Wrapper>
  );
}
