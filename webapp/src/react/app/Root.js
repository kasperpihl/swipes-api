import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Route, withRouter } from 'react-router-dom';

import * as a from 'actions';
import Gradient from 'components/gradient/Gradient';
import HOCApp from 'src/react/app/HOCApp';
import HOCRegistration from 'src/react/registration/HOCRegistration';
import HOCSignupPage from 'src/react/signup-page/HOCSignupPage';
import HOCContextMenu from 'src/react/app/context-menu/HOCContextMenu';
import HOCTooltip from 'src/react/app/tooltip/HOCTooltip';

import 'src/react/global-styles/reset.scss';
import 'src/react/global-styles/app.scss';

import HOCTopbar from './topbar/HOCTopbar';

let DevTools = 'div';

if (process.env.NODE_ENV !== 'production') {
  DevTools = require('src/DevTools').default; // eslint-disable-line global-require
}

class Root extends PureComponent {
  componentDidMount() {
    this.checkLoginStatus();
  }
  componentDidUpdate() {
    this.checkLoginStatus();
  }
  checkLoginStatus() {
    const { location, token, isHydrated, history } = this.props;
    const path = location.pathname;
    if (path === '/' && isHydrated && !token) {
      history.push('/login');
    }
    if (path === '/login' && isHydrated && token) {
      history.push('/');
    }
  }
  render() {
    const { isMaximized, isFullscreen, lastConnect } = this.props;
    let className = `platform-${window.ipcListener.platform}`;
    if(isMaximized) className += ' window-is-maximized';
    if(isFullscreen) className += ' window-is-fullscreen';

    return (
      <div id="app" className={className}>
        <Gradient />
        <HOCTopbar />
        <HOCContextMenu />
        <HOCTooltip />
        <DevTools />
        <div className="content-wrapper">
          <Route path="/" exact={true} component={HOCApp} />
          <Route path="/login" component={HOCRegistration} />
          <Route path="/signup" component={HOCSignupPage} />
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  isMaximized: state.getIn(['main', 'isMaximized']),
  isFullscreen: state.getIn(['main', 'isFullscreen']),
  isHydrated: state.getIn(['main', 'isHydrated']),
  token: state.getIn(['connection', 'token']),
})

export default withRouter(connect(mapStateToProps, {

})(Root));

const { bool } = PropTypes;

HOCApp.propTypes = {
  isFullscreen: bool,
  isMaximized: bool,
};
