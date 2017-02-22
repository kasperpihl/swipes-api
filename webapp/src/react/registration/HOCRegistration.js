import React, { Component, PropTypes } from 'react';
import { browserHistory, Link } from 'react-router';
import { connect } from 'react-redux';
import { api } from 'actions';
import Icon from 'Icon';

import './registration.scss';

import Signup from './Signup';
import Signin from './Signin';

class HOCRegistration extends Component {
  constructor(props) {
    super(props);
    this.signin = this.signin.bind(this);
    this.signup = this.signup.bind(this);
    this.state = { errorLabel: null };
  }
  componentDidUpdate() {
    const { token } = this.props;

    if (token) {
      browserHistory.push('/');
    }
  }
  signin(data) {
    this.signinOrUp('users.signin', data);
  }
  signup(data) {
    this.signinOrUp('users.signup', data);
  }
  signinOrUp(endpoint, data) {
    if (this.state.err !== null) {
      this.setState({ errorLabel: null });
    }
    this.props.request(endpoint, data).then((res) => {
      if (!res.ok) {
        let label = 'Something went wrong :/';
        console.log(res);
        if (res.err === "body /users.signup: Invalid object['invitation_code']: Invalid invitation code") {
          label = 'Invalid invitation code';
        }
        if (res.err === "body /users.signup: Invalid object['email']: did not match format") {
          label = 'Not a valid email';
        }
        this.setState({ errorLabel: label });
      }
    });
  }
  renderWrapper(children) {
    const { route } = this.props;
    let title = 'sign up to swipes';
    let subtitle = 'Already have an account?';
    let linkLabel = 'SIGN IN';
    let link = '/signin';

    if (route.path === 'signin') {
      title = 'sign in to swipes';
      subtitle = 'No account yet?';
      linkLabel = 'SIGN UP';
      link = '/signup';
    }

    return (
      <div className="sign">
        <div className="sign__wrapper">
          <div className="sign__logo">
            <Icon svg="SwipesLogo" />
          </div>
          <div className="sign__headline">Welcome to your Swipes</div>
          <div className="sign__card">
            <div className="sign__title">{title}</div>
            {children}
          </div>
          <div className="sign__subheadline">{subtitle}</div>
          <div className="sign__button"><Link to={link}>{linkLabel}</Link></div>
        </div>
      </div>
    );
  }
  render() {
    const { route } = this.props;
    const { errorLabel, loading } = this.state;
    const props = { errorLabel, loading };
    if (route.path === 'signin') {
      return this.renderWrapper(<Signin onLogin={this.signin} {...props} />);
    }

    return this.renderWrapper(<Signup onSignup={this.signup} {...props} />);
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
