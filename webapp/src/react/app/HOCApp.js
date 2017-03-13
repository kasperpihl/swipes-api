import React, { PureComponent, PropTypes } from 'react';
import { connect } from 'react-redux';
import * as a from 'actions';
import { browserHistory } from 'react-router';
import SwipesLoader from 'components/loaders/SwipesLoader';
import Gradient from 'components/gradient/Gradient';
import Topbar from './topbar/Topbar';
import HOCViewController from './view-controller/HOCViewController';
import HOCSidebar from './sidebar/HOCSidebar';
import HOCToasty from './toasty/HOCToasty';
import HOCContextMenu from './context-menu/HOCContextMenu';
import HOCTooltip from './tooltip/HOCTooltip';

let DevTools = 'div';

if (process.env.NODE_ENV !== 'production') {
  DevTools = require('src/DevTools'); // eslint-disable-line global-require
}

class HOCApp extends PureComponent {
  componentDidMount() {
    const { navSet } = this.props;
    navSet('primary', {
      id: 'GoalList',
      title: 'Goals',
    });
    this.updateMaximizeClass(this.props.isMaximized);
    this.updateFullscreenClass(this.props.isFullscreen);
  }

  componentDidUpdate(prevProps) {
    const { isMaximized, isFullscreen, token, isHydrated } = this.props;
    if (isHydrated && !token) {
      browserHistory.push('/login');
    }
    if (isMaximized !== prevProps.isMaximized) {
      this.updateMaximizeClass(isMaximized);
    }
    if (isFullscreen !== prevProps.isFullscreen) {
      this.updateFullscreenClass(isFullscreen);
    }
  }

  updateFullscreenClass(isFullscreen) {
    const classList = document.getElementById('content').classList;
    if (isFullscreen) {
      classList.add('window-is-fullscreen');
    } else {
      classList.remove('window-is-fullscreen');
    }
  }
  updateMaximizeClass(isMaximized) {
    const classList = document.getElementById('content').classList;
    if (isMaximized) {
      classList.add('window-is-maximized');
    } else {
      classList.remove('window-is-maximized');
    }
  }
  renderLoader() {
    const { lastConnect } = this.props;
    if (lastConnect) {
      return undefined;
    }
    return <SwipesLoader center text="Loading" size={90} />;
  }
  renderContent() {
    const { lastConnect } = this.props;
    if (!lastConnect) {
      return undefined;
    }
    return (
      <div className="content-wrapper">
        <div className="content-wrapper">
          <HOCSidebar />
          <HOCViewController />
        </div>
        <HOCToasty />
        <HOCContextMenu />
        <HOCTooltip />
        <DevTools />
      </div>
    );
  }
  render() {
    return (
      <div className="app">
        <Gradient />
        <Topbar />
        {this.renderLoader()}
        {this.renderContent()}
      </div>
    );
  }
}

const { func, bool, object, string } = PropTypes;

HOCApp.propTypes = {
  lastConnect: string,
  isHydrated: bool,
  token: string,
  navSet: func,
  isFullscreen: bool,
  isMaximized: bool,
};

function mapStateToProps(state) {
  return {
    isMaximized: state.getIn(['main', 'isMaximized']),
    isFullscreen: state.getIn(['main', 'isFullscreen']),
    isHydrated: state.getIn(['main', 'isHydrated']),
    status: state.getIn(['connection', 'status']),
    lastConnect: state.getIn(['connection', 'lastConnect']),
    token: state.getIn(['connection', 'token']),
  };
}

export default connect(mapStateToProps, {
  navSet: a.navigation.set,
})(HOCApp);
