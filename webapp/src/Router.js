import React, { PureComponent, PropTypes } from 'react';
import { Router, Route } from 'react-router';

import HOCRegistration from './react/registration/HOCRegistration';
import HOCApp from './react/app/HOCApp';

export default class Root extends PureComponent {
  render() {
    return (
      <Router history={this.props.history} >
        <Route path="/login" component={HOCRegistration} />
        <Route path="/signup" component={HOCRegistration} />
        <Route path="/" component={HOCApp} />
      </Router>
    );
  }
}

const { object } = PropTypes;

Root.propTypes = {
  store: object,
  history: object,
};
