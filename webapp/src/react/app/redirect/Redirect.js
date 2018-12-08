import React, { PureComponent } from 'react';

import { withRouter, Redirect as RedirectDOM } from 'react-router-dom';
import { connect } from 'react-redux';
import * as navigationActions from 'src/redux/navigation/navigationActions';

@withRouter
@connect(
  state => ({
    hasOrg: !!state.me.getIn(['organizations', 0]),
    isHydrated: state.main.get('isHydrated'),
    token: state.auth.get('token'),
    hasConnected: state.connection.get('hasConnected'),
    isBrowserSupported: state.globals.get('isBrowserSupported'),
    goToUrl: state.navigation.get('url'),
  }),
  {
    setUrl: navigationActions.url,
  }
)
export default class Redirect extends PureComponent {
  constructor(props) {
    super(props);
    this.state = { location: props.location };
  }
  componentDidMount() {
    this.unlisten = this.props.history.listen(location => {
      this.setState({
        location,
      });
    });
    this.checkRedirects();
  }
  componentDidUpdate() {
    this.checkRedirects();
  }
  checkRedirects() {
    // Reset if any
    const { location } = this.state;
    const {
      goToUrl,
      token,
      isHydrated,
      setUrl,
      hasOrg,
      isBrowserSupported,
      hasConnected,
    } = this.props;

    if (goToUrl && location.pathname === (goToUrl.to.pathname || goToUrl.to)) {
      setUrl(null);
    }

    const path = location.pathname;

    if (isHydrated && !token) {
      if (['/', '/welcome', '/invite', '/notsupported'].indexOf(path) > -1) {
        setUrl('/login');
      }
    }
    if (isHydrated && hasConnected) {
      if (['/login', '/register'].indexOf(path) > -1) {
        setUrl('/');
      }
      if (path === '/notsupported' && isBrowserSupported) {
        setUrl('/');
      }
      if (path === '/' && !hasOrg) {
        setUrl('/welcome');
      } else if (path === '/' && !isBrowserSupported) {
        setUrl('/notsupported');
      }
      if (path === '/welcome' && hasOrg) {
        if (isBrowserSupported) {
          setUrl('/');
        } else {
          setUrl('/notsupported');
        }
      }
    }
  }
  render() {
    const { goToUrl } = this.props;
    const { location } = this.state;
    if (goToUrl && location.pathname !== (goToUrl.to.pathname || goToUrl.to)) {
      return <RedirectDOM {...goToUrl} />;
    }
    return null;
  }
}
