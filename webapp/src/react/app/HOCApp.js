import React, { Component, PropTypes } from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import { connect } from 'react-redux';
import { api, navigation } from 'actions';

import Topbar from './topbar/Topbar';
import HOCModal from './modal/HOCModal';
import HOCViewController from './view-controller/HOCViewController';
import HOCSidebar from './sidebar/HOCSidebar';
import HOCOverlay from './overlay/HOCOverlay';
import HOCPreview from '../preview/HOCPreviewModal';
import HOCToasty from './toasty/HOCToasty';
import HOCSideNote from './side-note/HOCSideNote';
import HOCContextMenu from './context-menu/HOCContextMenu';

let DevTools = 'div';

if (process.env.NODE_ENV !== 'production') {
  DevTools = require('src/DevTools'); // eslint-disable-line global-require
}

class HOCApp extends Component {
  constructor(props) {
    super(props);
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
  }
  componentDidMount() {
    const { navInit } = this.props;
    navInit();
    this.updateMaximizeClass(this.props.isMaximized);
    this.updateFullscreenClass(this.props.isFullscreen);
  }
  updateFullscreenClass(isFullscreen) {
    const classList = document.getElementById('content').classList;
    if (isFullscreen) {
      classList.add('is-fullscreen');
    } else {
      classList.remove('is-fullscreen');
    }
  }
  updateMaximizeClass(isMaximized) {
    const classList = document.getElementById('content').classList;
    if (isMaximized) {
      classList.add('is-maximized');
    } else {
      classList.remove('is-maximized');
    }
  }
  componentDidUpdate(prevProps) {
    if (this.props.isMaximized !== prevProps.isMaximized) {
      this.updateMaximizeClass(this.props.isMaximized);
    }
    if (this.props.isFullscreen !== prevProps.isFullscreen) {
      this.updateFullscreenClass(this.props.isFullscreen);
    }
  }
  renderNote() {
    return <HOCSideNote />;
  }
  render() {
    const { location, status, isMaximized } = this.props;

    return (
      <div className="app">
        <Topbar
          pathname={location.pathname}
          status={status}
          isMaximized={isMaximized}
        />
        <div className="content-wrapper">
          <HOCSidebar />
          <div className="view-container">
            <HOCViewController target="primary" />
            <HOCViewController target="secondary" />
          </div>
          <HOCSideNote />
        </div>
        <HOCOverlay />
        <HOCModal />
        <HOCPreview />
        <HOCToasty />
        <HOCContextMenu />
        <DevTools />
      </div>
    );
  }
}

const { func, object, string } = PropTypes;

HOCApp.propTypes = {
  status: string,
  navInit: func,
  location: object,
};

function mapStateToProps(state) {
  return {
    status: state.getIn(['main', 'status']),
    isMaximized: state.getIn(['main', 'isMaximized']),
    isFullscreen: state.getIn(['main', 'isFullscreen']),
  };
}

const ConnectedHOCApp = connect(mapStateToProps, {
  navInit: navigation.init,
})(HOCApp);
export default ConnectedHOCApp;
