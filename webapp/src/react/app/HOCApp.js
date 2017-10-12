import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import HOCViewController from './view-controller/HOCViewController';
import HOCScreenSizeOverlay from './view-controller/HOCScreenSizeOverlay';
import HOCDownloadApp from './view-controller/HOCDownloadApp';
import HOCSidebar from './sidebar/HOCSidebar';

class HOCApp extends PureComponent {
  render() {
    const { ready } = this.props;
    if(!ready) {
      return null;
    }

    return (
      <div className="content-wrapper">
        <div className="content-wrapper__app">
          <HOCSidebar />
          <HOCViewController />
        </div>
        <HOCScreenSizeOverlay />
        <HOCDownloadApp />
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
