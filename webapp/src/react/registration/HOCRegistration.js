import React, { Component, PropTypes } from 'react';
import { browserHistory } from 'react-router';
import { connect } from 'react-redux';
import { api } from 'actions';
import { Link } from 'react-router';
import Icon from 'Icon';

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
            <Icon png="SwipesIcon" />
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

    if (route.path === 'signin') {
      return this.renderWrapper(<Signin onLogin={this.signin} />);
    }

    return this.renderWrapper(<Signup onSignup={this.signup} />);
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
