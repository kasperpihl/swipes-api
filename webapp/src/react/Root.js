import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Route, withRouter, Redirect } from 'react-router-dom';

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
    const { setUrl } = this.props;
    this.checkLoginStatus();
    if(this.clearUrl) {
      setUrl(null);
      this.clearUrl = false;
    }
  }
  checkLoginStatus() {
    const { location, token, isHydrated, setUrl } = this.props;
    const path = location.pathname;

    if(['/login', '/register', '/welcome'].indexOf(path) > -1 && isHydrated && token) {
      setUrl('/');
    }
    if (path === '/' && isHydrated && !token) {
      setUrl('/register');
    }

  }
  renderTopbar() {
    const { isElectron } = this.props;
    if (isElectron) {
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
  renderRedirect() {
    const { location, goToUrl } = this.props;
    if(goToUrl && location.pathname !== goToUrl) {
      return <Redirect to={goToUrl} push />
    } else if(goToUrl && location.pathname === goToUrl) {
      this.clearUrl = true;
    }
    return null;
  }
  render() {
    const { isMaximized, isFullscreen, platform, isBrowserSupported } = this.props;
    let className = `platform-${platform}`;
    if (isMaximized) className += ' window-is-maximized';
    if (isFullscreen) className += ' window-is-fullscreen';

    return (
      <div id="app" className={className}>
        {this.renderRedirect()}
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
            const Comp = require('src/react/app/HOCApp').default;
            return <Comp />;
          }} />
          <Route path="/download" render={() => {
            const Comp = require('compatible/pages/download/CompatibleDownload').default;
            return <Comp />;
          }} />
          <Route path="/login" render={() => {
            const Comp = require('compatible/pages/login/HOCCompatibleLogin').default;
            return <Comp />
          }} />
          <Route path="/register" render={() => {
            const Comp = require('compatible/pages/signup/HOCCompatibleSignup').default;
            return <Comp />
          }} />
          <Route path="/welcome" render={() => {
            const Comp = require('compatible/pages/welcome/HOCCompatibleWelcome').default;
            return <Comp />
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
  isElectron: state.getIn(['globals', 'isElectron']),
  isBrowserSupported: state.getIn(['globals', 'isBrowserSupported']),
  platform: state.getIn(['globals', 'platform']),
  goToUrl: state.getIn(['navigation', 'url']),
})

export default withRouter(connect(mapStateToProps, {
  setUrl: a.navigation.url,
})(Root));

const { bool } = PropTypes;

Root.propTypes = {
  isFullscreen: bool,
  isMaximized: bool,
};
 