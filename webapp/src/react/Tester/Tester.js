import React from 'react';
import DayTracker from 'src/react/_components/DayTracker/DayTracker';

export default function Tester() {
  const startDate = '2019-02-20';
  const endDate = '2019-02-25';
  const maxWeeks = 5;
  return (
    <div>
      <DayTracker
        startDate={startDate}
        endDate={endDate}
        maxWeeks={maxWeeks}
        compact
      />
      <DayTracker startDate={startDate} endDate={endDate} maxWeeks={maxWeeks} />
    </div>
  );
}
