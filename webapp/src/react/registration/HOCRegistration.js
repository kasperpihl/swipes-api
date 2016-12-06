import React, { Component, PropTypes } from 'react';
import { browserHistory } from 'react-router';
import { connect } from 'react-redux';
import { api } from 'actions';

import './registration.scss';

import Signup from './Signup';
import Signin from './Signin';

class HOCRegistration extends Component {
  constructor(props) {
    super(props);
    this.signin = this.signin.bind(this);
    this.signup = this.signup.bind(this);
  }
  componentDidUpdate() {
    const { token } = this.props;

    if (token) {
      browserHistory.push('/');
    }
  }
  signin(data) {
    this.props.request('users.signin', data);
  }
  signup(data) {
    this.props.request('users.signup', data);
  }
  render() {
    const { route } = this.props;

    if (route.path === 'signin') {
      return <Signin onLogin={this.signin} />;
    }

    return <Signup onSignup={this.signup} />;
  }
}

function mapStateToProps(state) {
  return {
    token: state.getIn(['main', 'token']),
  };
}

const { string, func, object } = PropTypes;

HOCRegistration.propTypes = {
  token: string,
  request: func,
  route: object,
};

const ConnectedHOCRegistration = connect(mapStateToProps, {
  request: api.request,
})(HOCRegistration);
export default ConnectedHOCRegistration;
