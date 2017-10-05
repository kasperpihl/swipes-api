import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { Route, withRouter } from 'react-router-dom';

import HOCUnsubscribe from 'src/react/pages/unsubscribe/HOCUnsubscribe';
import CompatibleDownload from 'compatible/pages/download/CompatibleDownload';
import HOCCompatibleLogin from 'compatible/pages/login/HOCCompatibleLogin';
import HOCCompatibleSignup from 'compatible/pages/signup/HOCCompatibleSignup';
import HOCCompatibleInvite from 'compatible/pages/invite/HOCCompatibleInvite';
import HOCCompatibleWelcome from 'compatible/pages/welcome/HOCCompatibleWelcome';
import HOCNotSupported from 'compatible/pages/not-supported/HOCNotSupported';

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
        <HOCTrial />
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
  isMaximized: state.getIn(['main', 'isMaximized']),
  isFullscreen: state.getIn(['main', 'isFullscreen']),

  platform: state.getIn(['globals', 'platform']),
});

export default withRouter(connect(mapStateToProps, {
})(Root));
 
