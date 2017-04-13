import React, { PureComponent } from 'react';
import { Route, withRouter } from 'react-router-dom';

import * as a from 'actions';
import Gradient from 'components/gradient/Gradient';
import HOCApp from 'src/react/app/HOCApp';
import HOCRegistration from 'src/react/registration/HOCRegistration';
import HOCSignupPage from 'src/react/signup-page/HOCSignupPage';

import 'src/react/global-styles/reset.scss';
import 'src/react/global-styles/app.scss';

import HOCTopbar from './topbar/HOCTopbar';

class Root extends PureComponent {
  componentDidMount() {
    if (window.ipcListener.platform) {
      document.getElementById('content').classList.add(`platform-${window.ipcListener.platform}`);
    }

  }
  render() {
    return (
      <div className="app">
        <Gradient />
        <HOCTopbar />
        <Route path="/" exact={true} component={HOCApp} />
        <Route path="/login" component={HOCRegistration} />
        <Route path="/signup" component={HOCSignupPage} />
      </div>
    );
  }
}

export default withRouter(Root);
