import React from 'react';
import moment from 'moment';
import Button from '_shared/Button/Button';
import Spacing from '_shared/Spacing/Spacing';
import SW from './WeekPicker.swiss';

export default function WeekPicker({ value, onChange }) {
  const [year, week] = value.split('-');
  const date = moment();
  const dWeek = moment();
  date.year(year);
  date.week(week);

  let weekLabel = `${year} Week ${week}`;
  if (date.isSame(dWeek, 'week')) {
    weekLabel = 'This week';
  }
  dWeek.subtract(1, 'weeks');
  if (date.isSame(dWeek, 'week')) {
    weekLabel = 'Last week';
  }
  dWeek.add(2, 'weeks');
  if (date.isSame(dWeek, 'week')) {
    weekLabel = 'Next week';
  }

  const handlePrev = () => {
    date.subtract(1, 'week');
    let newYearWeek = `${year}-${date.week()}`;
    if (week < date.week()) {
      newYearWeek = `${parseInt(year, 10) - 1}-${date.week()}`;
    }
    onChange(newYearWeek);
  };
  const handleNext = () => {
    date.add(1, 'week');
    let newYearWeek = `${year}-${date.week()}`;
    if (week > date.week()) {
      newYearWeek = `${parseInt(year, 10) + 1}-${date.week()}`;
    }
    onChange(newYearWeek);
  };

  return (
    <SW.Wrapper>
      <Button icon="ArrowLeft" onClick={handlePrev} />
      <SW.WeekLabel>{weekLabel}</SW.WeekLabel>
      {weekLabel !== 'Next week' ? (
        <Button icon="ArrowRight" onClick={handleNext} />
      ) : (
        <Spacing width={30} />
      )}
    </SW.Wrapper>
  );
}
