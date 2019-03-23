import React, { useMemo } from 'react';
import moment from 'moment';

import SW from './WeekIndicator.swiss';

export default function WeekIndicator({ yearWeek }) {
  const [monthLabel, weekArr] = useMemo(() => {
    const [year, week] = yearWeek.split('-');

    const today = moment();

    // Setting date to first day of the target week
    const d = moment();
    d.year(year);
    d.week(week);
    d.day(1);

    let monthLabel = d.format('MMMM');
    if (!d.isSame(today, 'year')) {
      monthLabel += ` '${d.format('YY')}`;
    }

    const weekArr = [];
    for (let i = 0; i < 5; i++) {
      weekArr.push({
        date: d.date(),
        current: d.isSame(today, 'day'),
        past: d.isBefore(today, 'day')
      });
      d.add(1, 'day');
    }

    return [monthLabel, weekArr];
  }, [yearWeek]);

  return (
    <SW.Wrapper>
      <SW.MonthLabel>{monthLabel}</SW.MonthLabel>
      <SW.Week>
        {weekArr.map(({ date, current, past }) => (
          <SW.Day key={date} current={current} past={past}>
            {date}
          </SW.Day>
        ))}
      </SW.Week>
    </SW.Wrapper>
  );
}
