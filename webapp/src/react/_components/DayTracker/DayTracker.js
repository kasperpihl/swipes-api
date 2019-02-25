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
          weekArr.push(new Array(weekday - 1).fill('hidden'));
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

  getWeekDayForNumber = number => {
    switch (number) {
      case 0:
        return 'M';
      case 1:
      case 3:
        return 'T';
      case 2:
        return 'W';
      case 4:
      default:
        return 'F';
    }
  };

  render() {
    const { compact } = this.props;
    return (
      <SW.ProvideContext compact={compact}>
        <SW.Wrapper>
          {this.getWeeksArr().map((week, i) => (
            <SW.Week key={i}>
              {week.map((state, j) => {
                return (
                  <SW.DayWrapper key={j}>
                    <SW.Day state={state}>
                      {!compact &&
                        state === 'upcoming' &&
                        this.getWeekDayForNumber(j)}
                    </SW.Day>
                  </SW.DayWrapper>
                );
              })}
            </SW.Week>
          ))}
        </SW.Wrapper>
      </SW.ProvideContext>
    );
  }
}
