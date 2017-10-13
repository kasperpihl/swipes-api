import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { Route, withRouter } from 'react-router-dom';

import HOCUnsubscribe from 'src/react/pages/unsubscribe/HOCUnsubscribe';
import HOCCompatibleDownload from 'compatible/pages/download/HOCCompatibleDownload';
import HOCCompatibleLogin from 'compatible/pages/login/HOCCompatibleLogin';
import HOCCompatibleSignup from 'compatible/pages/signup/HOCCompatibleSignup';
import HOCCompatibleInvite from 'compatible/pages/invite/HOCCompatibleInvite';
import HOCCompatibleWelcome from 'compatible/pages/welcome/HOCCompatibleWelcome';
import HOCNotSupported from 'compatible/pages/not-supported/HOCNotSupported';
import Dashboard from 'compatible/pages/dashboard/Dashboard';
import SwissTester from 'src/swiss/SwissTester';

import SwipesLoader from 'components/loaders/SwipesLoader';
import HOCRedirect from 'src/react/app/HOCRedirect';
import SuccessStateGradient from 'components/gradient/SuccessStateGradient';
import HOCAutoCompleting from 'components/auto-completing/HOCAutoCompleting';
import HOCTooltip from 'components/tooltip/HOCTooltip';
import HOCTopbar from 'components/topbar/HOCTopbar';
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
  renderRoutes() {
    const { status, hasConnected, isHydrated } = this.props;
    if(!isHydrated || (!hasConnected && status === 'connecting')) {
      return <SwipesLoader center text="Loading" size={90} />;
    }
    return [
      <Route key="1" path="/" exact render={() => {
        const { readyInOrg } = this.props;
        const Comp = require('src/react/app/HOCApp').default;
        return (readyInOrg && <Comp />) || null;
      }} />,
      <Route key="2" path="/notsupported" component={HOCNotSupported} />,
      <Route key="3" path="/unsubscribe" component={HOCUnsubscribe} />,
      <Route key="4" path="/download" component={HOCCompatibleDownload} />,
      <Route key="5" path="/login" component={HOCCompatibleLogin} />,
      <Route key="6" path="/register" component={HOCCompatibleSignup} />,
      <Route key="7" path="/invite" component={HOCCompatibleInvite} />,
      <Route key="8" path="/welcome" component={HOCCompatibleWelcome} />,
      <Route key="9" path="/dashboard" component={Dashboard} />,
      <Route key="10" path="/swiss" component={SwissTester} />,
    ];
  }
  render() {
    const { isMaximized, isFullscreen, platform } = this.props;
    let className = `platform-${platform}`;
    if (isMaximized) className += ' window-is-maximized';
    if (isFullscreen) className += ' window-is-fullscreen';

    return (
      <div id="app" className={className}>
        <HOCTopbar />
        <HOCRedirect />
        <Gradient />
        <HOCContextMenu />
        <SuccessStateGradient />
        <HOCAutoCompleting />
        <HOCTooltip />
        <DevTools />
        {this.renderRoutes()}
        <Route path="/" component={HOCTrial} />
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  isHydrated: state.getIn(['main', 'isHydrated']),
  isMaximized: state.getIn(['main', 'isMaximized']),
  isFullscreen: state.getIn(['main', 'isFullscreen']),
  platform: state.getIn(['globals', 'platform']),
  status: state.getIn(['connection', 'status']),
  hasConnected: state.getIn(['connection', 'hasConnected']),
  readyInOrg: state.getIn(['connection', 'readyInOrg']),
});

export default withRouter(connect(mapStateToProps, {
})(Root));
 
