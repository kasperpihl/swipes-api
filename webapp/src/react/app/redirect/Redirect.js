import React, { PureComponent } from 'react';

import { withRouter, Redirect as RedirectDOM } from 'react-router-dom';
import { connect } from 'react-redux';
import * as navigationActions from 'src/redux/navigation/navigationActions';

@withRouter
@connect(state => ({
  hasOrg: !!state.getIn(['me', 'organizations', 0]),
  isHydrated: state.getIn(['main', 'isHydrated']),
  token: state.getIn(['connection', 'token']),
  hasConnected: state.getIn(['connection', 'hasConnected']),
  isBrowserSupported: state.getIn(['globals', 'isBrowserSupported']),
  goToUrl: state.getIn(['navigation', 'url']),
}), {
  setUrl: navigationActions.url,
})

export default class Redirect extends PureComponent {
  componentDidMount() {
    this.checkRedirects();
  }
  componentDidUpdate() {
    this.checkRedirects();
  } 
  checkRedirects() {
    // Reset if any 
    const { 
      goToUrl,
      location,
      token,
      isHydrated,
      setUrl,
      hasOrg,
      isBrowserSupported,
      hasConnected,
    } = this.props;

    if(goToUrl && location.pathname === (goToUrl.to.pathname || goToUrl.to)) {
      setUrl(null);
    }

    const path = location.pathname;

    if(isHydrated && !token) {
      if (['/', '/welcome', '/invite', '/notsupported'].indexOf(path) > -1) {
        setUrl('/login');
      }
    }
    if(isHydrated && hasConnected) {
      if(['/login', '/register'].indexOf(path) > -1) {
        setUrl('/');
      }
      if(path === '/notsupported' && isBrowserSupported) {
        setUrl('/');
      }
      if(path === '/' && !hasOrg) {
        setUrl('/welcome');
      } else if(path === '/' && !isBrowserSupported) {
        setUrl('/notsupported');
      }
      if(path === '/welcome' && hasOrg) {
        if(isBrowserSupported) {
          setUrl('/');
        } else {
          setUrl('/notsupported');
        }
        
      }
    }

  }
  render() {
    const { location, goToUrl } = this.props;
    if(goToUrl && location.pathname !== (goToUrl.to.pathname || goToUrl.to)) {
      return <RedirectDOM {...goToUrl} />
    }
    return null;
  }
}