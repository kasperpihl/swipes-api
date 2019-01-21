import React, { PureComponent } from 'react';
import HOCViewController from './view-controller/HOCViewController';
import ScreenSizeOverlay from './screen-size-overlay/ScreenSizeOverlay';
import Invitation from 'src/react/_Layout/Invitation/Invitation';
import Sidebar from './sidebar/Sidebar';

export default class App extends PureComponent {
  render() {
    return (
      <div className="content-wrapper">
        <div className="content-wrapper__app">
          <Sidebar />
          <HOCViewController />
        </div>
        <Invitation />
        <ScreenSizeOverlay />
      </div>
    );
  }
}
