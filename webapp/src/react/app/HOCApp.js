import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import * as a from 'actions';
import SwipesLoader from 'components/loaders/SwipesLoader';
import HOCViewController from './view-controller/HOCViewController';
import HOCSidebar from './sidebar/HOCSidebar';
import HOCContextMenu from './context-menu/HOCContextMenu';
import HOCTooltip from './tooltip/HOCTooltip';

let DevTools = 'div';

if (process.env.NODE_ENV !== 'production') {
  DevTools = require('src/DevTools').default; // eslint-disable-line global-require
}

class HOCApp extends PureComponent {
  componentDidMount() {
    const { navSet } = this.props;
    navSet('primary', {
      id: 'Notifications',
      title: 'Notifications',
    });
    this.updateMaximizeClass(this.props.isMaximized);
    this.updateFullscreenClass(this.props.isFullscreen);
  }

  componentDidUpdate(prevProps) {
    const { isMaximized, isFullscreen, token, isHydrated } = this.props;
    if (isHydrated && !token) {
      console.log('hello');
      //browserHistory.push('/login');
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
    return <SwipesLoader center text="Loading" size={90} />;
  }
  render() {
    const { lastConnect } = this.props;
    if (!lastConnect) {
      return this.renderLoader();
    }
    return (
      <div className="content-wrapper">
        <div className="content-wrapper">
          <HOCSidebar />
          <HOCViewController />
        </div>

        <HOCContextMenu />
        <HOCTooltip />
        <DevTools />
      </div>
    );
  }
}

const { func, bool, string } = PropTypes;

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
