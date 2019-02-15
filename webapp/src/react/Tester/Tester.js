import React from 'react';
import moment, { max } from 'moment';
import DayTracker from 'src/react/_components/DayTracker/DayTracker';

export default function Tester() {
  const startDate = '2019-02-10';
  const endDate = '2019-02-15';
  const maxWeeks = 5;
  return (
    <div>
      <DayTracker startDate={startDate} endDate={endDate} maxWeeks={maxWeeks} />
    </div>
  );
}
