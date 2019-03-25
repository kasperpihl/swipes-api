import React from 'react';
import WeekIndicator from '_shared/WeekIndicator/WeekIndicator';
import WeekPicker from '_shared/WeekPicker/WeekPicker';
import Spacing from '_shared/Spacing/Spacing';
import SideHeader from '_shared/SideHeader/SideHeader';
import ProgressBar from '_shared/ProgressBar/ProgressBar';
import usePlanningState from 'src/react/Planning/usePlanningState';

import SW from './PlanningSide.swiss';

export default function PlanningSide({ yearWeek, setYearWeek }) {
  const [{ numberOfCompleted, totalNumberOfTasks }] = usePlanningState();
  function renderProgress() {
    if (typeof numberOfCompleted !== 'number') return null;
    return (
      <>
        <Spacing height={24} />
        <SideHeader
          largeNumber={numberOfCompleted}
          smallNumber={`/ ${totalNumberOfTasks}`}
          subtitle="Tasks Completed"
        />
        <Spacing height={9} />
        <ProgressBar
          progress={Math.ceil((numberOfCompleted / totalNumberOfTasks) * 100)}
        />
      </>
    );
  }
  return (
    <SW.Wrapper>
      <WeekPicker value={yearWeek} onChange={setYearWeek} />
      <Spacing height={30} />
      <WeekIndicator yearWeek={yearWeek} />
      {renderProgress()}
    </SW.Wrapper>
  );
}
