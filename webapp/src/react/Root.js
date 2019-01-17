import React, { PureComponent } from 'react';
import { hot } from 'react-hot-loader';
import { connect } from 'react-redux';
import {
  Route,
  withRouter,
  Switch,
  Redirect as RedirectDOM
} from 'react-router-dom';
import Unsubscribe from 'src/react/browser-compatible/pages/unsubscribe/Unsubscribe';
import HOCCompatibleLogin from 'src/react/browser-compatible/pages/login/HOCCompatibleLogin';
import CompatibleSignup from 'src/react/browser-compatible/pages/signup/CompatibleSignup';
import CompatibleConfirm from 'src/react/browser-compatible/pages/confirm/CompatibleConfirm';
import SwipesLoader from 'src/react/components/loaders/SwipesLoader';
import Redirect from 'src/react/app/redirect/Redirect';
// import HOCAutoCompleting from 'src/react/app/auto-completing/HOCAutoCompleting';
// import Trial from 'src/react/app/trial/Trial';
import Tooltip from 'src/react/app/tooltip/Tooltip';
import Topbar from 'src/react/app/topbar/Topbar';
import ContextMenu from 'src/react/app/context-menu/ContextMenu';
import Gradient from 'src/react/app/gradient/Gradient';
import * as invitationActions from 'src/redux/invitation/invitationActions';
import HOCDragAndDrop from 'src/react/components/drag-and-drop/HOCDragAndDrop';
import 'src/react/global-styles/reset.scss';
import 'src/react/global-styles/app.scss';

@withRouter
@connect(
  state => ({
    auth: state.auth,
    isHydrated: state.main.get('isHydrated'),
    isMaximized: state.main.get('isMaximized'),
    isFullscreen: state.main.get('isFullscreen'),
    platform: state.global.get('platform'),
    status: state.connection.get('status'),
    invitationToken: state.invitation.get('invitationToken'),
    lastConnect: state.connection.get('lastConnect')
  }),
  {
    invitationFetch: invitationActions.fetch
  }
)
@hot(module)
export default class Root extends PureComponent {
  componentDidMount() {
    if (this.props.invitationToken) {
      this.props.invitationFetch(this.props.invitationToken);
    }
  }
  renderRoutes() {
    const {
      status,
      lastConnect,
      isHydrated,
      auth,
      invitationToken,
      location
    } = this.props;

    if (location.search) {
      return <RedirectDOM to={location.pathname} />;
    }

    if (
      !isHydrated ||
      (auth.get('token') && !lastConnect && status !== 'online') ||
      invitationToken
    ) {
      return <SwipesLoader center text="Loading" size={90} />;
    }
    return (
      <Switch>
        <Route
          path="/"
          exact
          render={() => {
            const Comp = require('src/react/app/App').default;
            return <Comp />;
          }}
        />
        ,
        <Route path="/unsubscribe" component={Unsubscribe} />,
        <Route path="/login" component={HOCCompatibleLogin} />,
        <Route path="/register" component={CompatibleSignup} />,
        <Route path="/confirm" component={CompatibleConfirm} />
      </Switch>
    );
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
