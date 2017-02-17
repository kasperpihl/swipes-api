import React, { Component, PropTypes } from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import { connect } from 'react-redux';
import * as a from 'actions';

import SwipesLoader from 'components/loaders/SwipesLoader';
import Gradient from 'components/gradient/Gradient';
import Topbar from './topbar/Topbar';
import HOCModal from './modal/HOCModal';
import HOCViewController from './view-controller/HOCViewController';
import HOCSidebar from './sidebar/HOCSidebar';
import HOCToasty from './toasty/HOCToasty';
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

  componentDidUpdate(prevProps) {
    if (this.props.isMaximized !== prevProps.isMaximized) {
      this.updateMaximizeClass(this.props.isMaximized);
    }
    if (this.props.isFullscreen !== prevProps.isFullscreen) {
      this.updateFullscreenClass(this.props.isFullscreen);
    }
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
          <HOCViewController />
        </div>
        <HOCModal />
        <HOCToasty />
        <HOCContextMenu />
        <DevTools />
      </div>
    );
  }
  render() {
    const { location, status, isMaximized, nextRetry, hasLoaded } = this.props;
    return (
      <div className="app">
        <Gradient />
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
  nextRetry: object,
  hasLoaded: bool,
  isFullscreen: bool,
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
  navInit: a.navigation.init,
})(HOCApp);
export default ConnectedHOCApp;
