import React, { useMemo } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';

import WeekIndicator from '_shared/WeekIndicator/WeekIndicator';
import WeekPicker from '_shared/WeekPicker/WeekPicker';
import Spacing from '_shared/Spacing/Spacing';
import SideHeader from '_shared/SideHeader/SideHeader';
import ProgressBar from '_shared/ProgressBar/ProgressBar';
import TransferTasks from '_shared/TransferTasks/TransferTasks';

import usePlanningState from 'src/react/Planning/usePlanningState';

import request from 'core/utils/request';

import SW from './PlanningSide.swiss';

export default function PlanningSide({ yearWeek, setYearWeek, ownedBy }) {
  const [
    { numberOfCompleted = 0, totalNumberOfTasks = 0 }
  ] = usePlanningState();

  const allTasksCompleted =
    numberOfCompleted > 0 && numberOfCompleted === totalNumberOfTasks;

  const [
    isEndOfWeek,
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
    const isEndOfWeek = (now.days() > 4 && now.days() <= 6) || now.days() === 0;

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
      isEndOfWeek,
      isPrevWeek,
      isThisWeek,
      dMoment.isSame(now, 'week'),
      `${year}-${now.week()}`
    ];
  }, [yearWeek]);

  const handleNextWeek = () => {
    setYearWeek(nextWeekYearWeek);
  };

  // const handleTransferTasks = () => {
  //   let now = moment();
  //   let fromYearkWeek;
  //   let toYearWeek;
  //   if (isPrevWeek) {
  //     toYearWeek = now.year() + '-' + now.week();
  //     now = now.subtract(1, 'week');
  //     fromYearkWeek = now.year() + '-' + now.week();
  //   }
  //   if (isThisWeek || isNextWeek) {
  //     fromYearkWeek = now.year() + '-' + now.week();
  //     now = now.add(1, 'week');
  //     toYearWeek = now.year() + '-' + now.week();
  //   }
  //   if (numberOfCompleted > 0 && numberOfCompleted < totalNumberOfTasks) {
  //     request('planning.moveTasks', {
  //       owned_by: ownedBy,
  //       from_year_week: fromYearkWeek,
  //       to_year_week: toYearWeek
  //     });
  //   }
  // };

  return (
    <SW.Wrapper>
      <WeekPicker value={yearWeek} onChange={setYearWeek} />
      <Spacing height={24} />
      <WeekIndicator yearWeek={yearWeek} />
      <Spacing height={30} />
      <SideHeader
        largeNumber={numberOfCompleted}
        smallNumber={`/ ${totalNumberOfTasks}`}
        subtitle="Tasks"
      />
      <Spacing height={12} />
      <ProgressBar
        progress={Math.ceil((numberOfCompleted / totalNumberOfTasks) * 100)}
      />
      <Spacing height={48} />
      <TransferTasks
        // isPrevWeek={isPrevWeek && !allTasksCompleted && totalNumberOfTasks > 0}
        isThisWeek={
          isThisWeek &&
          isEndOfWeek &&
          !allTasksCompleted &&
          totalNumberOfTasks > 0
        }
        // isNextWeek={isNextWeek && !allTasksCompleted}
        // handleClick={handleTransferTasks}
        handleClick={handleNextWeek}
      />
    </SW.Wrapper>
  );
}
