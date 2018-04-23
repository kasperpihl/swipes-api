import React, { PureComponent } from 'react';
import { hot } from 'react-hot-loader';
import { connect } from 'react-redux';
import { Route, withRouter } from 'react-router-dom';

import HOCUnsubscribe from 'src/react/pages/unsubscribe/HOCUnsubscribe';
import CompatibleDownload from 'compatible/pages/download/CompatibleDownload';
import HOCPlanCSVExporter from 'compatible/pages/plan-csv-exporter/HOCPlanCSVExporter';
import HOCCompatibleLogin from 'compatible/pages/login/HOCCompatibleLogin';
import HOCCompatibleSignup from 'compatible/pages/signup/HOCCompatibleSignup';
import HOCCompatibleInvite from 'compatible/pages/invite/HOCCompatibleInvite';
import HOCCompatibleWelcome from 'compatible/pages/welcome/HOCCompatibleWelcome';
import HOCCompatibleConfirm from 'compatible/pages/confirm/HOCCompatibleConfirm';
import HOCNotSupported from 'compatible/pages/not-supported/HOCNotSupported';

import SwipesLoader from 'src/react/components/loaders/SwipesLoader';
import Redirect from 'src/react/app/redirect/Redirect';
import HOCAutoCompleting from 'src/react/app/auto-completing/HOCAutoCompleting';
import Trial from 'src/react/app/trial/Trial';
import Tooltip from 'src/react/app/tooltip/Tooltip';
import Topbar from 'src/react/app/topbar/Topbar';
import ContextMenu from 'src/react/app/context-menu/ContextMenu';
import Gradient from 'src/react/app/gradient/Gradient';

import 'src/react/global-styles/reset.scss';
import 'src/react/global-styles/app.scss';

class Root extends PureComponent {
  renderRoutes() {
    const { status, hasConnected, isHydrated } = this.props;
    if(!isHydrated || (!hasConnected && status === 'connecting')) {
      return <SwipesLoader center text="Loading" size={90} />;
    }
    return [
      <Route key="1" path="/" exact render={() => {
        const { readyInOrg } = this.props;
        const Comp = require('src/react/app/App').default;
        return (readyInOrg && <Comp />) || null;
      }} />,
      <Route key="2" path="/notsupported" component={HOCNotSupported} />,
      <Route key="3" path="/unsubscribe" component={HOCUnsubscribe} />,
      <Route key="4" path="/download" component={CompatibleDownload} />,
      <Route key="5" path="/plan-csv-exporter" component={HOCPlanCSVExporter} />,
      <Route key="6" path="/login" component={HOCCompatibleLogin} />,
      <Route key="7" path="/register" component={HOCCompatibleSignup} />,
      <Route key="8" path="/invite" component={HOCCompatibleInvite} />,
      <Route key="9" path="/welcome" component={HOCCompatibleWelcome} />,
      <Route key="10" path="/confirm" component={HOCCompatibleConfirm} />,
    ];
  }
  render() {
    const { isMaximized, isFullscreen, platform } = this.props;
    let className = `platform-${platform}`;
    if (isMaximized) className += ' window-is-maximized';
    if (isFullscreen) className += ' window-is-fullscreen';

    return (
      <div id="app" className={className}>
        <div id="draggable"></div>
        <Topbar />
        <Redirect />
        <Gradient />
        <ContextMenu />
        <HOCAutoCompleting />
        <Tooltip />
        {this.renderRoutes()}
        <Route path="/" component={Trial} />
      </div>
    )
  }
}

export default withRouter(connect(state => ({
  isHydrated: state.getIn(['main', 'isHydrated']),
  isMaximized: state.getIn(['main', 'isMaximized']),
  isFullscreen: state.getIn(['main', 'isFullscreen']),
  platform: state.getIn(['globals', 'platform']),
  status: state.getIn(['connection', 'status']),
  hasConnected: state.getIn(['connection', 'hasConnected']),
  readyInOrg: state.getIn(['connection', 'readyInOrg']),
}))(hot(module)(Root)));
 
