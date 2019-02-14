import React, { PureComponent } from 'react';
import moment from 'moment';
import SW from './DayTracker.swiss';

export default class DayTracker extends PureComponent {
  getWeeksArr = () => {
    const { startDate, endDate, maxWeeks } = this.props;
    const currentDate = moment();
    const mEndDate = moment(endDate);
    let deltaDate = moment(startDate);
    const targetDate = moment.max(mEndDate, currentDate);
    const weekArr = [];
    let deltaIndex = -1;
    while (deltaDate.isSameOrBefore(targetDate, 'day')) {
      const weekday = deltaDate.day();
      if (weekday > 0 && weekday < 6) {
        if (!weekArr[deltaIndex] || weekArr[deltaIndex].length === 5) {
          weekArr.push(new Array(weekday - 1).fill('hidden', 0));
          deltaIndex++;
        }
        const deltaWeek = weekArr[deltaIndex];
        let state = 'completed';
        if (deltaDate.isAfter(currentDate)) {
          state = 'upcoming';
        }
        if (deltaDate.isAfter(mEndDate)) {
          state = 'overdue';
        }
        deltaWeek.push(state);
      }
      deltaDate.add(1, 'days');
    }
    if (maxWeeks) {
      return weekArr.slice(0, maxWeeks);
    }
    return weekArr;
  };

  render() {
    return (
      <SW.Wrapper>
        {this.getWeeksArr().map((week, i) => (
          <SW.Week key={i}>
            {week.map((state, j) => (
              <SW.Day state={state} key={j} />
            ))}
          </SW.Week>
        ))}
      </SW.Wrapper>
    );
  }
}
