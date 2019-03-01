import React, { useState } from 'react';
import SW from './PlanSidePicker.swiss';
import moment from 'moment';
import cachedCallback from 'src/utils/cachedCallback';
import DayTracker from 'src/react/_components/DayTracker/DayTracker';
import request from 'core/utils/request';

export default function PlanSidePicker({ plan }) {
  const defTwoWeekState =
    moment(plan.start_date).diff(moment(plan.end_date), 'days') < -4;

  const [twoWeekState, setTwoWeekState] = useState(defTwoWeekState);
  const [endDate, setEndDate] = useState(plan.end_date);

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

  return (
    <SW.Wrapper>
      <SW.Title>Start date</SW.Title>
      <SW.Day>{moment(plan.start_date).format('ddd, MMM D')}</SW.Day>
      <input
        onChange={handleUpdateCached('one')}
        type="radio"
        checked={!twoWeekState}
      />{' '}
      1 week{' '}
      <input
        onChange={handleUpdateCached('two')}
        type="radio"
        checked={twoWeekState}
      />{' '}
      2 weeks
      <DayTracker startDate={plan.start_date} endDate={endDate} />
    </SW.Wrapper>
  );
}
