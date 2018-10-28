import React, { PureComponent } from 'react';

import { withRouter, Redirect as RedirectDOM } from 'react-router-dom';
import { connect } from 'react-redux';
import * as navigationActions from 'src/redux/navigation/navigationActions';

@withRouter
@connect(
  state => ({
    isHydrated: state.main.get('isHydrated'),
    token: state.auth.get('token'),
    hasConnected: state.connection.get('hasConnected'),
    goToUrl: state.navigation.get('url'),
  }),
  {
    setUrl: navigationActions.url,
  }
)
export default class Redirect extends PureComponent {
  componentDidMount() {
    this.checkRedirects();
  }
  componentDidUpdate() {
    this.checkRedirects();
  }
  checkRedirects() {
    // Reset if any
    const { location } = this.props;
    const { goToUrl, token, isHydrated, setUrl, hasConnected } = this.props;

    if (goToUrl && location.pathname === (goToUrl.to.pathname || goToUrl.to)) {
      setUrl(null);
    }

    const path = location.pathname;

    if (isHydrated && !token) {
      if (['/'].indexOf(path) > -1) {
        setUrl('/login');
      }
    }
    if (isHydrated && hasConnected) {
      if (['/login', '/register'].indexOf(path) > -1) {
        setUrl('/');
      }
    }
  }
  render() {
    const { goToUrl, location } = this.props;
    if (goToUrl && location.pathname !== (goToUrl.to.pathname || goToUrl.to)) {
      return <RedirectDOM {...goToUrl} />;
    }
    return null;
  }
}
