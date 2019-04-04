import React, { useMemo } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';

import WeekIndicator from '_shared/WeekIndicator/WeekIndicator';
import WeekPicker from '_shared/WeekPicker/WeekPicker';
import Spacing from '_shared/Spacing/Spacing';
import SideHeader from '_shared/SideHeader/SideHeader';
import ProgressBar from '_shared/ProgressBar/ProgressBar';
import Dropdown from '_shared/dropdown/Dropdown';
import TransferTasks from '_shared/TransferTasks/TransferTasks';

import usePlanningState from 'src/react/Planning/usePlanningState';

import SW from './PlanningSide.swiss';

export default function PlanningSide({
  yearWeek,
  setYearWeek,
  teams,
  onChangeTeam
}) {
  const [
    { numberOfCompleted = 0, totalNumberOfTasks = 0 }
  ] = usePlanningState();

  const [
    isFriday,
    isPrevWeek,
    isThisWeek,
    isNextWeek,
    nextWeekYearWeek
  ] = useMemo(() => {
    const dMoment = moment();
    dMoment.year(yearWeek.split('-')[0]);
    dMoment.week(yearWeek.split('-')[1]);

    const now = moment();
    const isThisWeek = dMoment.isSame(now, 'week');
    const isFriday = now.days() === 5;

    let year = now.year();
    let week = now.week();
    now.add(1, 'week');
    if (now.week() < week) {
      year = year + 1;
    }

    let dPrevWeek = moment();
    let isPrevWeek = false;
    if (dMoment.week() < dPrevWeek.week()) {
      isPrevWeek = true;
    }

    return [
      isFriday,
      isPrevWeek,
      isThisWeek,
      dMoment.isSame(now, 'week'),
      `${year}-${now.week()}`
    ];
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
        subtitle="Completed"
      />
      <Spacing height={12} />
      <ProgressBar
        progress={Math.ceil((numberOfCompleted / totalNumberOfTasks) * 100)}
      />
      <Spacing height={24} />
      <Dropdown items={teams} onChange={onChangeTeam} />
      <Spacing height={48} />
      <TransferTasks
        isPrevWeek={isPrevWeek}
        isThisWeek={isThisWeek && isFriday}
        isNextWeek={isNextWeek}
      />
    </SW.Wrapper>
  );
}
