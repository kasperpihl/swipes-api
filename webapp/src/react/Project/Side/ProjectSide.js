import React, { useState, useEffect, memo } from 'react';
import useProjectSlice from 'core/react/_hooks/useProjectSlice';
import contextMenu from 'src/utils/contextMenu';
import successGradient from 'src/utils/successGradient';

import AssignMenu from '_shared/AssignMenu/AssignMenu';
import SideHeader from '_shared/SideHeader/SideHeader';
import ProgressBar from '_shared/ProgressBar/ProgressBar';
import Spacing from '_shared/Spacing/Spacing';

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

  const completedTasksAmount = Math.round(
    (completionPercentage / 100) * totalAmountOfTasks
  );

  const openAssignMenu = e => {
    const ownedBy = stateManager.getClientState().get('owned_by');
    contextMenu(AssignMenu, e, {
      excludeMe: true,
      hideRowOnSelect: true,
      selectedIds: followers,
      organizationId: ownedBy,
      onSelect: id => {
        console.log(id);
      }
    });
  };

  const handleCompleteAll = () => {
    if (completionPercentage < 100) {
      successGradient('green');
    }
    stateManager.completeHandler.completeAll(completionPercentage < 100);
  };

  console.log(followers);
  return (
    <SW.Wrapper>
      <SideHeader
        title={completedTasksAmount}
        smallTitle={`/${totalAmountOfTasks}`}
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
        <SW.Button title="Add people" icon="Person" onClick={openAssignMenu} />
      </SW.ButtonWrapper>
      <Spacing height={6} />
      {maxIndention > 0 && (
        <SW.StepSlider
          max={maxIndention}
          sliderValue={sliderValue}
          onSliderChange={handleSliderChange}
        />
      )}
    </SW.Wrapper>
  );
}
