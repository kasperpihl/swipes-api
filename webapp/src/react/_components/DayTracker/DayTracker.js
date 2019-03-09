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
    const now = moment();
    while (deltaDate.isSameOrBefore(targetDate, 'day')) {
      const weekday = deltaDate.day();
      if (weekday > 0 && weekday < 6) {
        if (!weekArr[deltaIndex] || weekArr[deltaIndex].length === 5) {
          weekArr.push(new Array(weekday - 1).fill('hidden'));
          deltaIndex++;
        }
        const deltaWeek = weekArr[deltaIndex];
        const state = {
          status: 'completed'
        };
        if (deltaDate.isAfter(currentDate)) {
          state.status = 'upcoming';
        }
        if (deltaDate.isAfter(mEndDate)) {
          state.status = 'overdue';
        }
        if (deltaDate.isSame(now, 'day')) {
          state.currentDate = true;
        } else if (deltaDate.day() === 5) {
          const sunday = moment(deltaDate).add(2, 'days');
          if (now.isBetween(deltaDate, sunday, 'days', '[]')) {
            console.log('current!');
            state.currentDate = true;
          }
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
    const { compact, showCurrentDateMarker } = this.props;

    return (
      <SW.ProvideContext compact={compact}>
        <SW.Wrapper>
          {this.getWeeksArr().map((week, i) => (
            <SW.Week key={i}>
              {week.map((state, j) => {
                return (
                  <SW.DayWrapper key={j}>
                    {showCurrentDateMarker && state.currentDate && (
                      <SW.Indicator
                        icon="DayTrackerArrow"
                        size={8}
                        overdue={state.status === 'overdue'}
                      />
                    )}
                    <SW.Day state={state.status}>
                      {!compact &&
                        state.status === 'upcoming' &&
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
