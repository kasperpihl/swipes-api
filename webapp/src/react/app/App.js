import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import HOCViewController from './view-controller/HOCViewController';
import ScreenSizeOverlay from './screen-size-overlay/ScreenSizeOverlay';
import Sidebar from './sidebar/Sidebar';

@connect(state => ({
  ready: !!state.me.getIn(['organizations', 0]),
}))
export default class App extends PureComponent {
  render() {
    const { ready } = this.props;
    if (!ready) {
      return null;
    }

    return (
      <div className="content-wrapper">
        <div className="content-wrapper__app">
          <Sidebar />
          <HOCViewController />
        </div>
        <ScreenSizeOverlay />
      </div>
    );
  }
}
