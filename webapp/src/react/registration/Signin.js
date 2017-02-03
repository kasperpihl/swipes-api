import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import Icon from 'Icon';
// import SwipesBackgroundAnimation from './SwipesBackgroundAnimation';
import FloatingInput from 'components/swipes-ui/FloatingInput';


export default class Signin extends Component {
  constructor(props) {
    super(props);
    this.signin = this.signin.bind(this);
  }
  componentDidMount() {
  }
  signin() {
    const email = this.refs.username.state.value;
    const password = this.refs.password.state.value;
    const data = {
      email,
      password,
    };

    return this.props.onLogin(data);
  }
  preventSubmit(e) {
    e.preventDefault();
  }
  render() {
    const { errorLable, loading } = this.props;
    let loadingClass = 'sign__form__loader';

    if (loading) {
      loadingClass += ' sign__form__loader--active';
    }

    return (
      <form className="sign__form" action="" onSubmit={this.preventSubmit}>
        <br />
        <FloatingInput
          label="Email"
          type="email"
          id="email"
          ref="username"
          error={errorLable}
        />
        <FloatingInput
          label="Password"
          type="password"
          id="password"
          ref="password"
          error={errorLable}
        />
        <br />
        <div className="sign__error-status">{errorLable}</div>
        <button
          className="sign__form__button sign__form__button--submit"
          onClick={this.signin}
        >
          <div className={loadingClass} />
          SIGN IN
        </button>
      </form>
    );
  }
}

const { func, string, bool } = PropTypes;

Signin.propTypes = {
  onLogin: func,
  errorLable: string,
  loading: bool,
};
