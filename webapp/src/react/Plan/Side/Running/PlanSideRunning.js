import React from 'react';

import SideHeader from 'src/react/_components/SideHeader/SideHeader';
import ProgressBar from 'src/react/_components/ProgressBar/ProgressBar';
import StepSlider from 'src/react/_components/StepSlider/StepSlider';

import SW from './PlanSideRunning.swiss';

export default function PlanSideRunning({ plan }) {
  return (
    <SW.Wrapper>
      <SideHeader title={plan.task_counter} subtitle="Tasks selected" />
      <ProgressBar progress={50} />
      <SW.ButtonWrapper>
        <SW.Button title="End plan" icon="Complete" />
      </SW.ButtonWrapper>
      <StepSlider />
    </SW.Wrapper>
  );
}
