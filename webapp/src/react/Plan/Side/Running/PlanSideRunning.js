import React from 'react';

import SideHeader from 'src/react/_components/SideHeader/SideHeader';
import ProgressBar from 'src/react/_components/ProgressBar/ProgressBar';
// import StepSlider from 'src/react/_components/StepSlider/StepSlider';
import DayTracker from 'src/react/_components/DayTracker/DayTracker';
import Spacing from '_shared/Spacing/Spacing';

import SW from './PlanSideRunning.swiss';

export default function PlanSideRunning({ plan, hasPending, planState }) {
  if (hasPending) return <SW.Wrapper />;
  const totalTasks = plan.tasks.length;
  let totalCompleted = 0;
  Object.values(planState).forEach(({ numberOfCompleted }) => {
    totalCompleted += numberOfCompleted;
  });
  const percentage = Math.round((totalCompleted / totalTasks) * 100);

  return (
    <SW.Wrapper>
      <SideHeader title={7} subtitle="Work days left" />
      <Spacing height={12} />
      <DayTracker
        startDate={plan.start_date}
        endDate={plan.end_date}
        showCurrentDateMarker
      />
      <Spacing height={30} />
      <SideHeader
        smallTitle={`/ ${plan.tasks.length}`}
        title={totalCompleted}
        subtitle="Tasks completed"
      />
      <Spacing height={18} />
      <ProgressBar progress={percentage} />

      <SW.ButtonWrapper>
        <SW.Button title="End plan" icon="Complete" />
      </SW.ButtonWrapper>
      {/* <StepSlider /> */}
    </SW.Wrapper>
  );
}
