import React, { useState, useEffect, memo } from 'react';
import useProjectSlice from 'core/react/_hooks/useProjectSlice';
import contextMenu from 'src/utils/contextMenu';

import AssignMenu from 'src/react/_components/AssignMenu/AssignMenu';
import SideHeader from 'src/react/_components/SideHeader/SideHeader';
import ProgressBar from 'src/react/_components/ProgressBar/ProgressBar';

import SW from './ProjectSide.swiss';

export default memo(ProjectSide);
function ProjectSide({ stateManager }) {
  const [sliderValue, setSliderValue] = useState(0);

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
    if (sliderValue > maxIndention) {
      setSliderValue(maxIndention);
    }
  });

  const handleSliderChange = e => {
    const depth = parseInt(e.target.value, 10);
    stateManager.expandHandler.setDepth(depth);
    setSliderValue(depth);
  };
  const handleIncrease = () => {
    stateManager.expandHandler.setDepth(sliderValue + 1);
    setSliderValue(sliderValue + 1);
  };
  const handleDecrease = () => {
    stateManager.expandHandler.setDepth(sliderValue - 1);
    setSliderValue(sliderValue - 1);
  };

  const completedTasksAmount = Math.round(
    (completionPercentage / 100) * totalAmountOfTasks
  );

  const openAssignMenu = e => {
    const ownedBy = stateManager.getClientState().get('owned_by');
    contextMenu(AssignMenu, e, {
      excludeMe: true,
      selectedIds: followers,
      organizationId: ownedBy,
      onSelect: followers => handleAssignSelect(followers)
    });
  };

  console.log(followers);

  return (
    <SW.Wrapper>
      <SideHeader
        title={completedTasksAmount}
        smallTitle={`/${totalAmountOfTasks}`}
        subtitle="Tasks Completed"
      />
      <ProgressBar progress={completionPercentage} />
      <SW.ButtonWrapper>
        <SW.Button title="Complete project" icon="Complete" />
        <SW.Button title="Add people" icon="Person" onClick={openAssignMenu} />
      </SW.ButtonWrapper>
      {maxIndention > 0 && (
        <SW.StepSlider
          min={0}
          max={maxIndention}
          sliderValue={sliderValue}
          onSliderChange={handleSliderChange}
          increase={handleIncrease}
          decrease={handleDecrease}
        />
      )}
    </SW.Wrapper>
  );
}
