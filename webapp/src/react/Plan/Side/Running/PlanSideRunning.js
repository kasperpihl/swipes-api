import React, { useMemo, useState } from 'react';
import moment from 'moment';

import SideHeader from 'src/react/_components/SideHeader/SideHeader';
import ProgressBar from 'src/react/_components/ProgressBar/ProgressBar';
import StepSlider from 'src/react/_components/StepSlider/StepSlider';
import DayTracker from 'src/react/_components/DayTracker/DayTracker';
import Spacing from '_shared/Spacing/Spacing';
import request from 'core/utils/request';

import SW from './PlanSideRunning.swiss';

export default function PlanSideRunning({ plan, hasPending, planState }) {
  const [sliderValue, setSliderValue] = useState(0);

  const totalTasks = plan.tasks.length;
  let totalCompleted = 0;
  let maxDepth = 0;
  Object.values(planState).forEach(({ numberOfCompleted, maxIndention }) => {
    maxDepth = Math.max(maxDepth, maxIndention);
    totalCompleted += numberOfCompleted;
  });
  const percentage = Math.round((totalCompleted / totalTasks) * 100);

  const workdaysLeft = useMemo(() => {
    const currentDate = moment();
    const endDate = moment(plan.end_date);
    let daysObj = {
      amount: 0,
      text: 'left'
    };
    let startDate = currentDate;
    let targetDate = endDate;
    if (currentDate.isBefore(plan.start_date, 'day')) {
      targetDate = moment(plan.start_date);
      daysObj.text = 'until start';
    } else if (currentDate.isAfter(endDate, 'day')) {
      startDate = endDate;
      targetDate = currentDate;
      daysObj.text = 'overdue';
    }

    while (startDate.isBefore(targetDate, 'day')) {
      if (startDate.day() > 0 && startDate.day() < 6) {
        daysObj.amount++;
      }
      startDate.add(1, 'day');
    }
    return daysObj;
  }, [plan.start_date, plan.end_date]);

  const handleSliderChange = e => {
    const depth = parseInt(e.target.value, 10);
    setSliderValue(depth);
    Object.values(planState).forEach(({ stateManager }) => {
      stateManager.expandHandler.setDepth(depth);
    });
  };

  const handleEnd = () => {
    request('plan.end', {
      plan_id: plan.plan_id
    });
  };
  if (hasPending) return <SW.Wrapper />;

  return (
    <SW.Wrapper>
      <SideHeader
        title={workdaysLeft.amount}
        subtitle={`Work day${workdaysLeft.amount === 1 ? '' : 's'} ${
          workdaysLeft.text
        }`}
      />
      <Spacing height={15} />
      <DayTracker
        startDate={plan.start_date}
        endDate={plan.end_date}
        showCurrentDateMarker
      />
      <Spacing height={24} />
      <SideHeader
        smallTitle={`/ ${plan.tasks.length}`}
        title={totalCompleted}
        subtitle="Tasks completed"
      />
      <Spacing height={18} />
      <ProgressBar progress={percentage} />
      <Spacing height={24} />
      <SW.ButtonWrapper>
        <SW.Button title="End plan" icon="Complete" onClick={handleEnd} />
        <Spacing height={8} />
      </SW.ButtonWrapper>
      <Spacing height={6} />
      {maxDepth > 0 && (
        <StepSlider
          max={maxDepth}
          sliderValue={sliderValue}
          onSliderChange={handleSliderChange}
        />
      )}
    </SW.Wrapper>
  );
}
