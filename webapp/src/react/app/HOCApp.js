import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import HOCViewController from './view-controller/HOCViewController';
import ScreenSizeOverlay from './view-controller/ScreenSizeOverlay';
import HOCSidebar from './sidebar/HOCSidebar';

class HOCApp extends PureComponent {
  render() {
    const { ready } = this.props;
    if(!ready) {
      return null;
    }

    return (
      <div className="content-wrapper">
        <HOCSidebar />
        <HOCViewController />
        <ScreenSizeOverlay />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    ready: state.getIn(['me', 'has_organization']),
  };
}

export default connect(mapStateToProps, {
})(HOCApp);
