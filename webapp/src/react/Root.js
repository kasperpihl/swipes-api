import React, { PureComponent } from 'react';
import { hot } from 'react-hot-loader';
import { connect } from 'react-redux';
import {
  Route,
  withRouter,
  Switch,
  Redirect as RedirectDOM
} from 'react-router-dom';
import Unsubscribe from 'src/react/Unsubscribe/Unsubscribe';
import Authentication from 'src/react/Authentication/Authentication';

import ConfirmAccount from 'src/react/ConfirmAccount/ConfirmAccount';
import SwipesLoader from 'src/react/_components/loaders/SwipesLoader';
import Redirect from 'src/react/_Layout/redirect/Redirect';
// import HOCAutoCompleting from 'src/react/_Layout/auto-completing/HOCAutoCompleting';
import Tooltip from 'src/react/_Layout/tooltip/Tooltip';
import Topbar from 'src/react/_Layout/topbar/Topbar';
import ContextMenu from 'src/react/_Layout/ContextMenu/ContextMenu';
import Gradient from 'src/react/_Layout/gradient/Gradient';
import * as invitationActions from 'src/redux/invitation/invitationActions';
import HOCDragAndDrop from 'src/react/_components/drag-and-drop/HOCDragAndDrop';
import { MyIdContext } from 'src/react/contexts';
import 'src/scss/reset.scss';
import 'src/scss/app.scss';

@withRouter
@connect(
  state => ({
    myId: state.me.get('user_id'),
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
            const Comp = require('src/react/_Layout/App').default;
            return <Comp />;
          }}
        />
        ,
        <Route path="/unsubscribe" component={Unsubscribe} />,
        <Route path="/login" component={Authentication} />,
        <Route path="/register" component={Authentication} />,
        <Route path="/confirm" component={ConfirmAccount} />
      </Switch>
    );
  }
  render() {
    const { isMaximized, isFullscreen, platform, myId } = this.props;
    let className = `platform-${platform}`;
    if (isMaximized) className += ' window-is-maximized';
    if (isFullscreen) className += ' window-is-fullscreen';

    return (
      <MyIdContext.Provider value={myId}>
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
        </div>
      </MyIdContext.Provider>
    );
  }
}
