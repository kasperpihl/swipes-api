import React, { PureComponent } from 'react';
import { hot } from 'react-hot-loader';
import { connect } from 'react-redux';
import { Route, withRouter } from 'react-router-dom';
import Unsubscribe from 'src/react/browser-compatible/pages/unsubscribe/Unsubscribe';
import HOCCompatibleLogin from 'src/react/browser-compatible/pages/login/HOCCompatibleLogin';
import HOCCompatibleSignup from 'src/react/browser-compatible/pages/signup/HOCCompatibleSignup';
import CompatibleConfirm from 'src/react/browser-compatible/pages/confirm/CompatibleConfirm';
import SwipesLoader from 'src/react/components/loaders/SwipesLoader';
import Redirect from 'src/react/app/redirect/Redirect';
// import HOCAutoCompleting from 'src/react/app/auto-completing/HOCAutoCompleting';
// import Trial from 'src/react/app/trial/Trial';
import Tooltip from 'src/react/app/tooltip/Tooltip';
import Topbar from 'src/react/app/topbar/Topbar';
import ContextMenu from 'src/react/app/context-menu/ContextMenu';
import Gradient from 'src/react/app/gradient/Gradient';
import HOCDragAndDrop from 'src/react/components/drag-and-drop/HOCDragAndDrop';
import 'src/react/global-styles/reset.scss';
import 'src/react/global-styles/app.scss';

@withRouter
@connect(state => ({
  auth: state.auth,
  isHydrated: state.main.get('isHydrated'),
  isMaximized: state.main.get('isMaximized'),
  isFullscreen: state.main.get('isFullscreen'),
  platform: state.global.get('platform'),
  status: state.connection.get('status'),
  lastConnect: state.connection.get('lastConnect')
}))
@hot(module)
export default class extends PureComponent {
  renderRoutes() {
    const { status, lastConnect, isHydrated, auth } = this.props;
    if (
      !isHydrated ||
      (auth.get('token') && !lastConnect && status !== 'online')
    ) {
      return <SwipesLoader center text="Loading" size={90} />;
    }
    return [
      <Route
        key="1"
        path="/"
        exact
        render={() => {
          const Comp = require('src/react/app/App').default;
          return <Comp />;
        }}
      />,
      <Route key="3" path="/unsubscribe" component={Unsubscribe} />,
      <Route key="6" path="/login" component={HOCCompatibleLogin} />,
      <Route key="7" path="/register" component={HOCCompatibleSignup} />,
      <Route key="10" path="/confirm" component={CompatibleConfirm} />
    ];
  }
  render() {
    const { isMaximized, isFullscreen, platform } = this.props;
    let className = `platform-${platform}`;
    if (isMaximized) className += ' window-is-maximized';
    if (isFullscreen) className += ' window-is-fullscreen';

    return (
      <div id="app" className={className}>
        <div id="draggable" />
        <Redirect />
        <Gradient />
        <ContextMenu />
        {/* <HOCAutoCompleting /> */}
        <Tooltip />
        <HOCDragAndDrop>
          <Topbar />
          {this.renderRoutes()}
        </HOCDragAndDrop>
        {/* <Route path="/" component={Trial} /> */}
      </div>
    );
  }
}
