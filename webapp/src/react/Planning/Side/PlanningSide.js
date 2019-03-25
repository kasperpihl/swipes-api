import React from 'react';
import WeekIndicator from '_shared/WeekIndicator/WeekIndicator';
import WeekPicker from '_shared/WeekPicker/WeekPicker';
import Spacing from '_shared/Spacing/Spacing';

import SW from './PlanningSide.swiss';

export default function PlanningSide({ yearWeek, setYearWeek }) {
  return (
    <SW.Wrapper>
      <WeekPicker value={yearWeek} onChange={setYearWeek} />
      <Spacing height={30} />
      <WeekIndicator yearWeek={yearWeek} />
    </SW.Wrapper>
  );
}
