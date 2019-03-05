import React, { useState } from 'react';
import moment from 'moment';
import cachedCallback from 'src/utils/cachedCallback';
import request from 'core/utils/request';
import contextMenu from 'src/utils/contextMenu';

import DayTracker from 'src/react/_components/DayTracker/DayTracker';
import ListMenu from 'src/react/_components/ListMenu/ListMenu';

import SW from './PlanSidePicker.swiss';

export default function PlanSidePicker({ plan }) {
  const defTwoWeekState =
    moment(plan.start_date).diff(moment(plan.end_date), 'days') < -4;

  const [twoWeekState, setTwoWeekState] = useState(defTwoWeekState);
  const [endDate, setEndDate] = useState(plan.end_date);
  const [showDropdown, setShowDropdown] = useState(false);

  const handleUpdateCached = cachedCallback(async weeks => {
    const twoWeeks = weeks === 'two';
    const daysToAdd = twoWeeks ? 11 : 4;
    // Let's be optimistic.
    setTwoWeekState(twoWeeks);
    const newEndDate = moment(plan.start_date)
      .add(daysToAdd, 'days')
      .format('YYYY-MM-DD');

    setEndDate(newEndDate);

    const res = await request('plan.setDateRange', {
      plan_id: plan.plan_id,
      start_date: plan.start_date,
      end_date: newEndDate
    });
    if (!res.ok) {
      // Reset optimistic values
      setEndDate(plan.end_date);
      setTwoWeekState(defTwoWeekState);
    }
  });

  const handleUpdateStartDay = async i => {
    const startDate = moment()
      .day(1)
      .add(i, 'weeks');
    const daysToAdd = twoWeekState ? 11 : 4;
    const updatedEndDate = moment(startDate)
      .add(daysToAdd, 'days')
      .format('YYYY-MM-DD');

    setEndDate(updatedEndDate);
    const res = await request('plan.setDateRange', {
      plan_id: plan.plan_id,
      start_date: startDate.format('YYYY-MM-DD'),
      end_date: updatedEndDate
    });
    if (!res.ok) {
      setEndDate(plan.end_date);
      setTwoWeekState(defTwoWeekState);
    }
  };

  const openWeeksList = e => {
    const arr = [0, 1, 2, 3, 4];
    const monday = moment().day(1);

    contextMenu(ListMenu, e, {
      onClick: handleUpdateStartDay,
      buttons: arr.map(i => {
        const weekNumber = `W${monday.week()}`;
        let text = monday.format('ddd, MMM D');
        if (i === 0) {
          text = 'This week';
        } else if (i === 1) {
          text = 'Next week';
        }
        const dateKey = monday.format('YYYY-MM-DD');
        monday.add(1, 'week');
        return (
          <SW.DropdownRow>
            <SW.WeekNumber>{weekNumber}</SW.WeekNumber>
            <SW.RowText>{text}</SW.RowText>
          </SW.DropdownRow>
        );
      })
    });
  };

  const now = moment();
  let startDate = moment(plan.start_date);
  let startDateText;
  if (now.isSame(startDate, 'week')) {
    startDateText = 'This week';
  } else if (now.add(1, 'week').isSame(startDate, 'week')) {
    startDateText = 'Next week';
  } else {
    startDateText = startDate.format('ddd, MMM D');
  }

  return (
    <SW.Wrapper>
      <SW.Title>Start time</SW.Title>
      <SW.Day onClick={openWeeksList}>
        <SW.WeekNumber compact>W{startDate.week()}</SW.WeekNumber>
        {startDateText}
        <SW.Icon icon="ArrowDown" size={24} show={showDropdown} />
      </SW.Day>
      <SW.Title>Duration</SW.Title>
      <SW.InputContainer>
        <SW.InputWrapper
          checked={!twoWeekState}
          onClick={handleUpdateCached('one')}
        >
          <SW.Input
            onChange={handleUpdateCached('one')}
            type="radio"
            checked={!twoWeekState}
          />{' '}
          <SW.InputText checked={!twoWeekState}>1 week</SW.InputText>{' '}
        </SW.InputWrapper>
        <SW.InputWrapper
          checked={twoWeekState}
          onClick={handleUpdateCached('two')}
        >
          <SW.Input
            onChange={handleUpdateCached('two')}
            type="radio"
            checked={twoWeekState}
          />{' '}
          <SW.InputText checked={twoWeekState}>2 weeks</SW.InputText>
        </SW.InputWrapper>
      </SW.InputContainer>
      <DayTracker startDate={plan.start_date} endDate={endDate} />
    </SW.Wrapper>
  );
}
