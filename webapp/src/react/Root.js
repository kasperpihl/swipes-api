import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Route, withRouter } from 'react-router-dom';

import * as a from 'actions';
import Gradient from 'components/gradient/Gradient';

import 'src/react/global-styles/reset.scss';
import 'src/react/global-styles/app.scss';

let DevTools = 'div';

if (process.env.NODE_ENV !== 'production') {
  DevTools = require('components/dev-tools/DevTools').default; // eslint-disable-line global-require
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
    if (path === '/unsubscribe') {
      return;
    }
    // if (path === '/' && !window.ipcListener.isElectron) {
    //   history.push('/welcome');
    // }

    if (path === '/' && isHydrated && !token) {
      history.push('/login');
    }

    if (path === '/login' && isHydrated && token) {
      history.push('/');
    }
  }
  renderTopbar() {
    if (window.ipcListener.isElectron) {
      const HOCTopbar = require('components/topbar/HOCTopbar').default;
      return <HOCTopbar />;
    }
    return undefined;
  }
  renderAppComponents(name) {
    const arr = ['SuccessStateGradient', 'HOCAutoCompleting', 'HOCContextMenu', 'HOCTooltip', 'HOCTrial'];
    return arr.map((name) => (
      <Route path="/" exact key={name} render={() => {
        const Comps = {
          SuccessStateGradient: require('components/gradient/SuccessStateGradient').default,
          HOCAutoCompleting: require('components/auto-completing/HOCAutoCompleting').default,
          HOCContextMenu: require('components/context-menu/HOCContextMenu').default,
          HOCTooltip: require('components/tooltip/HOCTooltip').default,
          HOCTrial: require('components/trial/HOCTrial').default,
        };
        const Comp = Comps[name];
        return <Comp />;
      }} />
    ))
  }
  render() {
    const { isMaximized, isFullscreen, lastConnect } = this.props;
    let className = `platform-${window.ipcListener.platform}`;
    if (isMaximized) className += ' window-is-maximized';
    if (isFullscreen) className += ' window-is-fullscreen';

    return (
      <div id="app" className={className}>
        <Gradient />
        {this.renderTopbar()}
        {this.renderAppComponents()}
        <DevTools />
        <div className="content-wrapper">
          <Route path="/unsubscribe" render={() => {
            const HOCUnsubscribe = require('src/react/pages/unsubscribe/HOCUnsubscribe').default;
            return <HOCUnsubscribe />;
          }} />
          <Route path="/" exact render={() => {
            const HOCApp = require('src/react/app/HOCApp').default;
            return <HOCApp />;
          }} />
          <Route path="/login" render={() => {
            const HOCRegistration = require('src/react/registration/HOCRegistration').default;
            return <HOCRegistration />;
          }} />
          <Route path="/signup" render={() => {
            const HOCSignupPage = require('src/react/browser-compatible/pages/signup/HOCCompatibleSignup').default;
            return <HOCSignupPage />
          }} />
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

Root.propTypes = {
  isFullscreen: bool,
  isMaximized: bool,
};
