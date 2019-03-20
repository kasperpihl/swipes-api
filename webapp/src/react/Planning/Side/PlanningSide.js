import React from 'react';
import SW from './PlanningSide.swiss';

export default function PlanningSide({ weeks, weekIndex, setWeekIndex }) {
  return (
    <SW.Wrapper>
      {weeks.map(([title, date], i) => (
        <SW.Week
          key={title}
          selected={weekIndex === i}
          onClick={() => {
            setWeekIndex(i);
          }}
        >
          <SW.WeekNumber>W{date.week()}</SW.WeekNumber>
          {title}
        </SW.Week>
      ))}
    </SW.Wrapper>
  );
}
