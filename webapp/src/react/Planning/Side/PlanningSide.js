import React from 'react';
import WeekIndicator from '_shared/WeekIndicator/WeekIndicator';
import WeekPicker from '_shared/WeekPicker/WeekPicker';
import Spacing from '_shared/Spacing/Spacing';
import SideHeader from '_shared/SideHeader/SideHeader';
import ProgressBar from '_shared/ProgressBar/ProgressBar';

import SW from './PlanningSide.swiss';

export default function PlanningSide({ yearWeek, setYearWeek }) {
  return (
    <SW.Wrapper>
      <WeekPicker value={yearWeek} onChange={setYearWeek} />
      <Spacing height={30} />
      <WeekIndicator yearWeek={yearWeek} />
      <Spacing height={24} />
      <SideHeader
        largeNumber={20}
        smallNumber={`/ ${25}`}
        subtitle="Tasks Completed"
      />
      <Spacing height={9} />
      <ProgressBar progress={50} />
    </SW.Wrapper>
  );
}
