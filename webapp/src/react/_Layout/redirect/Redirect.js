import React, { PureComponent } from 'react';

import { withRouter, Redirect as RedirectDOM } from 'react-router-dom';
import { connect } from 'react-redux';
import * as navigationActions from 'src/redux/navigation/navigationActions';

@withRouter
@connect(
  state => ({
    isHydrated: state.main.get('isHydrated'),
    token: state.auth.get('token'),
    lastConnect: state.connection.get('lastConnect'),
    goToUrl: state.navigation.get('url')
  }),
  {
    redirectTo: navigationActions.redirectTo
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
        location
      });
    });
    this.checkRedirects();
  }
  componentDidUpdate() {
    this.checkRedirects();
  }
  checkRedirects() {
    // Reset if any
    const { location } = this.props;
    const { goToUrl, token, isHydrated, redirectTo, lastConnect } = this.props;
    if (goToUrl && location.pathname === (goToUrl.to.pathname || goToUrl.to)) {
      redirectTo(null);
    }

    const path = location.pathname;

    if (isHydrated && !token) {
      if (['/'].indexOf(path) > -1) {
        redirectTo('/login');
      }
    }
    if (isHydrated && lastConnect) {
      if (['/login', '/register'].indexOf(path) > -1) {
        redirectTo('/');
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
