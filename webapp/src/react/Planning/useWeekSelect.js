import { useMemo, useState } from 'react';
import moment from 'moment';

export default function useWeekSelect() {
  const [weekIndex, setWeekIndex] = useState(1);
  const thisWeek = useMemo(() => moment(), []);
  const nextWeek = useMemo(() => moment(thisWeek).add(1, 'weeks'), []);
  const lastWeek = useMemo(() => moment(thisWeek).subtract(1, 'weeks'), []);

  const weeks = [
    ['Last week', lastWeek],
    ['This week', thisWeek],
    ['Next week', nextWeek]
  ];

  return [weeks, weekIndex, setWeekIndex];
}
