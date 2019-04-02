import React from 'react';
import moment from 'moment';
import parseWeekLabel from 'core/utils/time/parseWeekLabel';
import Button from '_shared/Button/Button';
import Spacing from '_shared/Spacing/Spacing';
import SW from './WeekPicker.swiss';

export default function WeekPicker({ value, onChange }) {
  const [year, week] = value.split('-');
  const date = moment();
  date.year(year);
  date.week(week);
  const weekLabel = parseWeekLabel(value);

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
