import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import HOCViewController from './view-controller/HOCViewController';
import ScreenSizeOverlay from './screen-size-overlay/ScreenSizeOverlay';
import Sidebar from './sidebar/Sidebar';

class App extends PureComponent {
  render() {
    const { ready } = this.props;
    if(!ready) {
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

export default connect(state => ({
  ready: state.getIn(['me', 'has_organization']),
}))(App);
