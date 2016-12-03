import React, { Component, PropTypes } from 'react';
import { browserHistory } from 'react-router';
import { connect } from 'react-redux';
import { api } from '../actions';

import '../components/registration/registration.scss';

import Signup from '../components/registration/Signup';
import Signin from '../components/registration/Signin';

class Registration extends Component {
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

    if (route.path === 'singin') {
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

Registration.propTypes = {
  token: string,
  request: func,
  route: object,
};

const ConnectedRegistration = connect(mapStateToProps, {
  request: api.request,
})(Registration);
export default ConnectedRegistration;
