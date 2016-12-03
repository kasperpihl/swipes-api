import React, { Component, PropTypes } from 'react';
import { Router, Route } from 'react-router';

import Registration from './containers/Registration';
import App from './containers/App';

export default class Root extends Component {
  constructor(props) {
    super(props);
    this.didEnterRegistration = this.didEnterRegistration.bind(this);
    this.didEnterApp = this.didEnterApp.bind(this);
  }
  // Check if signed in, otherwise redirect to signin
  didEnterApp(nextState, replace) {
    const { store } = this.props;

    if (!store.getState().getIn(['main', 'token'])) {
      return replace('/signin');
    }

    return undefined;
  }
  // Check if signed in and redirect to app
  didEnterRegistration() {
    const { store } = this.props;

    if (store.getState().getIn(['main', 'token'])) {
      return window.location.assign('/');
    }

    return undefined;
  }
  render() {
    return (
      <Router history={this.props.history} >
        <Route path="signin" component={Registration} onEnter={this.didEnterRegistration} />
        <Route path="signup" component={Registration} onEnter={this.didEnterRegistration} />
        <Route path="/" component={App} onEnter={this.didEnterApp} />
      </Router>
    );
  }
}

const { object } = PropTypes;

Root.propTypes = {
  store: object,
  history: object,
};
