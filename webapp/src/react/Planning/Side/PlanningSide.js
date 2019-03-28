import React, { useMemo } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';

import WeekIndicator from '_shared/WeekIndicator/WeekIndicator';
import WeekPicker from '_shared/WeekPicker/WeekPicker';
import Spacing from '_shared/Spacing/Spacing';
import SideHeader from '_shared/SideHeader/SideHeader';
import ProgressBar from '_shared/ProgressBar/ProgressBar';
import usePlanningState from 'src/react/Planning/usePlanningState';

import SW from './PlanningSide.swiss';
import Dropdown from '_shared/dropdown/Dropdown';

export default function PlanningSide({
  yearWeek,
  setYearWeek,
  teams,
  onChangeTeam
}) {
  const [
    { numberOfCompleted = 0, totalNumberOfTasks = 0 }
  ] = usePlanningState();

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

  return (
    <SW.Wrapper>
      <WeekPicker value={yearWeek} onChange={setYearWeek} />
      <Spacing height={24} />
      <WeekIndicator yearWeek={yearWeek} />
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
      <Spacing height={12} />
      <Dropdown items={teams} onChange={onChangeTeam} />
    </SW.Wrapper>
  );
}
