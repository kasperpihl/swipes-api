import React, { useMemo } from 'react';
import moment from 'moment';

import WeekIndicator from '_shared/WeekIndicator/WeekIndicator';
import WeekPicker from '_shared/WeekPicker/WeekPicker';
import Spacing from '_shared/Spacing/Spacing';
import SideHeader from '_shared/SideHeader/SideHeader';
import ProgressBar from '_shared/ProgressBar/ProgressBar';
import usePlanningState from 'src/react/Planning/usePlanningState';

import SW from './PlanningSide.swiss';

export default function PlanningSide({ yearWeek, setYearWeek }) {
  const [{ numberOfCompleted, totalNumberOfTasks }] = usePlanningState();

  const [isThisWeek, isNextWeek, nextWeekYearWeek] = useMemo(() => {
    const dMoment = moment();
    dMoment.year(yearWeek.split('-')[0]);
    dMoment.week(yearWeek.split('-')[1]);

    const now = moment();
    const isThisWeek = dMoment.isSame(now, 'week');

    let year = now.year();
    let week = now.week();
    now.add(1, 'week');
    if (now.week() < week) {
      year = year + 1;
    }

    return [isThisWeek, dMoment.isSame(now, 'week'), `${year}-${now.week()}`];
  }, [yearWeek]);

  const handleNextWeek = () => {
    setYearWeek(nextWeekYearWeek);
  };
  console.log('is this', isThisWeek, 'is next', isNextWeek);

  return (
    <SW.Wrapper>
      <WeekPicker value={yearWeek} onChange={setYearWeek} />
      <Spacing height={24} />
      <WeekIndicator yearWeek={yearWeek} />
      {typeof numberOfCompleted === 'number' && (
        <>
          <Spacing height={30} />
          <SideHeader
            largeNumber={numberOfCompleted}
            smallNumber={`/ ${totalNumberOfTasks}`}
            subtitle="Tasks Completed"
          />
          <Spacing height={12} />
          <ProgressBar
            progress={Math.ceil((numberOfCompleted / totalNumberOfTasks) * 100)}
          />
        </>
      )}
    </SW.Wrapper>
  );
}
