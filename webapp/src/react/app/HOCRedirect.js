import React, { PureComponent } from 'react';
// import PropTypes from 'prop-types';
import { withRouter, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import * as a from 'actions';


class HOCRedirect extends PureComponent {
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
    } = this.props;

    if(goToUrl && location.pathname === goToUrl) {
      setUrl(null);
    }



    const path = location.pathname;

    if(isHydrated && !token) {
      if (['/', '/welcome', '/invite', '/notsupported', '/download'].indexOf(path) > -1) {
        // setUrl('/register');
      }
    }
    if(isHydrated && token) {
      if(['/login', '/register'].indexOf(path) > -1) {
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
    if(goToUrl && location.pathname !== goToUrl) {
      return <Redirect to={goToUrl} push />
    }
    return null;
  }
}
// const { string } = PropTypes;

HOCRedirect.propTypes = {};

const mapStateToProps = (state) => ({
  hasOrg: state.getIn(['me', 'has_organization']),
  isHydrated: state.getIn(['main', 'isHydrated']),
  token: state.getIn(['connection', 'token']),
  isBrowserSupported: state.getIn(['globals', 'isBrowserSupported']),
  goToUrl: state.getIn(['navigation', 'url']),
});

export default withRouter(connect(mapStateToProps, {
  setUrl: a.navigation.url,
})(HOCRedirect));