import React, { Component, PropTypes } from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import { connect } from 'react-redux';
import { api, navigation } from 'actions';

import SwipesLoader from 'components/loaders/SwipesLoader';
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
  renderLoader() {
    const { hasLoaded } = this.props;
    if (hasLoaded) {
      return undefined;
    }
    return <SwipesLoader center text="Loading" size={90} />;
  }
  renderContent() {
    const { hasLoaded } = this.props;
    if (!hasLoaded) {
      return undefined;
    }
    return (
      <div className="content-wrapper">
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
  renderNote() {
    return <HOCSideNote />;
  }
  render() {
    const { location, status, isMaximized, nextRetry, hasLoaded } = this.props;
    return (
      <div className="app">
        <Topbar
          pathname={location.pathname}
          status={status}
          nextRetry={nextRetry}
          isMaximized={isMaximized}
          hasLoaded={hasLoaded}
        />
        {this.renderLoader()}
        {this.renderContent()}
      </div>
    );
  }
}

const { func, object, string, bool } = PropTypes;

HOCApp.propTypes = {
  status: string,
  navInit: func,
  location: object,
  hasLoaded: bool,
  isMaximized: bool,
};

function mapStateToProps(state) {
  return {
    status: state.getIn(['main', 'status']),
    nextRetry: state.getIn(['main', 'nextRetry']),
    isMaximized: state.getIn(['main', 'isMaximized']),
    isFullscreen: state.getIn(['main', 'isFullscreen']),
    hasLoaded: state.getIn(['main', 'hasLoaded']),
  };
}

const ConnectedHOCApp = connect(mapStateToProps, {
  navInit: navigation.init,
})(HOCApp);
export default ConnectedHOCApp;
