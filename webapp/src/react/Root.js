import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Route, withRouter, Redirect } from 'react-router-dom';

import * as a from 'actions';

import HOCUnsubscribe from 'src/react/pages/unsubscribe/HOCUnsubscribe';
import CompatibleDownload from 'compatible/pages/download/CompatibleDownload';
import HOCCompatibleLogin from 'compatible/pages/login/HOCCompatibleLogin';
import HOCCompatibleSignup from 'compatible/pages/signup/HOCCompatibleSignup';
import HOCCompatibleInvite from 'compatible/pages/invite/HOCCompatibleInvite';
import HOCCompatibleWelcome from 'compatible/pages/welcome/HOCCompatibleWelcome';
import HOCNotSupported from 'compatible/pages/not-supported/HOCNotSupported';

import SuccessStateGradient from 'components/gradient/SuccessStateGradient';
import HOCAutoCompleting from 'components/auto-completing/HOCAutoCompleting';
import HOCTooltip from 'components/tooltip/HOCTooltip';
import HOCTrial from 'components/trial/HOCTrial';

import HOCContextMenu from 'components/context-menu/HOCContextMenu';
import Gradient from 'components/gradient/Gradient';

import 'src/react/global-styles/reset.scss';
import 'src/react/global-styles/app.scss';

let DevTools = 'div';

if (process.env.NODE_ENV !== 'production') {
  DevTools = require('components/dev-tools/DevTools').default; // eslint-disable-line global-require
}

class Root extends PureComponent {
  componentDidMount() {
    this.checkRedirects();
  }
  componentDidUpdate() {
    const { setUrl } = this.props;
    this.checkRedirects();
    if(this.clearUrl) {
      setUrl(null);
      this.clearUrl = false;
    }
  }
  checkRedirects() {
    const { 
      location,
      token,
      isHydrated,
      setUrl,
      numberOfOrgs,
      isBrowserSupported,
    } = this.props;

    const path = location.pathname;

    if(isHydrated && !token) {
      if (['/', '/welcome', '/invite', '/notsupported', '/download'].indexOf(path) > -1) {
        setUrl('/register');
      }
    }
    if(isHydrated && token) {
      if(['/login', '/register'].indexOf(path) > -1) {
        setUrl('/');
      }
      if(path === '/' && !numberOfOrgs) {
        setUrl('/welcome');
      } else if(path === '/' && !isBrowserSupported) {
        setUrl('/notsupported');
      }
      if(path === '/welcome' && numberOfOrgs) {
        if(isBrowserSupported) {
          setUrl('/');
        } else {
          setUrl('/notsupported');
        }
        
      }
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
        <HOCContextMenu />
        <SuccessStateGradient />
        <HOCAutoCompleting />
        <HOCTooltip />
        <HOCTrial />
        {this.renderTopbar()}
        <DevTools />
        <Route path="/" exact render={() => {
          const Comp = require('src/react/app/HOCApp').default;
          return <Comp />;
        }} />
        <Route path="/notsupported" component={HOCNotSupported} />
        <Route path="/unsubscribe" component={HOCUnsubscribe} />
        <Route path="/download" component={CompatibleDownload} />
        <Route path="/login" component={HOCCompatibleLogin} />
        <Route path="/register" component={HOCCompatibleSignup} />
        <Route path="/invite" component={HOCCompatibleInvite} />
        <Route path="/welcome" component={HOCCompatibleWelcome} />
        
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  numberOfOrgs: state.getIn(['me', 'organizations']) && state.getIn(['me', 'organizations']).size,
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
 
