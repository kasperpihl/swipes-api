import React, { useState, useEffect, memo } from 'react';
import useProjectSlice from 'core/react/_hooks/useProjectSlice';
import contextMenu from 'src/utils/contextMenu';
import successGradient from 'src/utils/successGradient';

import AssignMenu from '_shared/AssignMenu/AssignMenu';
import SideHeader from '_shared/SideHeader/SideHeader';
import ProgressBar from '_shared/ProgressBar/ProgressBar';
import Spacing from '_shared/Spacing/Spacing';
import Stepper from '_shared/Stepper/Stepper';

import SW from './ProjectSide.swiss';

export default memo(ProjectSide);

function ProjectSide({ stateManager }) {
  const [sliderValue, setSliderValue] = useState(1);

  const [followers, handleAssignSelect] = useState([]);

  const [
    totalAmountOfTasks,
    completionPercentage,
    maxIndention
  ] = useProjectSlice(stateManager, (clientState, localState) => [
    clientState.get('sortedOrder').size,
    clientState.get('completion_percentage'),
    localState.get('maxIndention')
  ]);

  useEffect(() => {
    if (stateManager && maxIndention > 0) {
      setSliderValue(2);
      stateManager.expandHandler.setDepth(1);
    }
  }, [stateManager]);

  useEffect(() => {
    if (sliderValue > maxIndention + 1) {
      setSliderValue(maxIndention);
    }
  });

  const handleSliderChange = value => {
    stateManager.expandHandler.setDepth(value - 1);
    setSliderValue(value);
  };

  const completedTasksAmount = Math.round(
    (completionPercentage / 100) * totalAmountOfTasks
  );

  const openAssignMenu = e => {
    const ownedBy = stateManager.getClientState().get('owned_by');
    contextMenu(AssignMenu, e, {
      excludeMe: true,
      hideRowOnSelect: true,
      selectedIds: followers,
      teamId: ownedBy,
      onSelect: id => {
        console.log(id); // TODO: Add endpoint to add people to project
      }
    });
  };

  const handleCompleteAll = () => {
    if (completionPercentage < 100) {
      successGradient('green');
    }
    stateManager.completeHandler.completeAll(completionPercentage < 100);
  };

  const isPublic = stateManager.getClientState().get('privacy') === 'public';

  return (
    <SW.Wrapper>
      <SideHeader
        largeNumber={completedTasksAmount}
        smallNumber={`/ ${totalAmountOfTasks}`}
        subtitle="Tasks Completed"
      />
      <Spacing height={18} />
      <ProgressBar progress={completionPercentage} />
      <SW.ButtonWrapper>
        <SW.Button
          title={
            completionPercentage === 100 ? 'Redo project' : 'Complete project'
          }
          icon="Complete"
          onClick={handleCompleteAll}
        />
        {!isPublic && (
          <SW.Button
            title="Add people"
            icon="Person"
            onClick={openAssignMenu}
          />
        )}
      </SW.ButtonWrapper>
      <Spacing height={6} />
      {maxIndention > 0 && (
        <Stepper
          maxValue={maxIndention + 1}
          value={sliderValue}
          onChange={handleSliderChange}
        />
      )}
    </SW.Wrapper>
  );
}
