import React, { Component } from 'react';
import DayTracker from '../_components/DayTracker/DayTracker';
export default class Tester extends Component {
  render() {
    const startDate = '2019-02-20';
    const endDate = '2019-02-25';
    return (
      <div style={{ width: '100%' }}>
        <DayTracker
          startDate={startDate}
          endDate={endDate}
          showCurrentDateMarker
        />
      </div>
    );
  }
}
