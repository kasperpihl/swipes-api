import React, { Component, PropTypes } from 'react';
import { setupCachedCallback } from 'classes/utils';
import FloatingInput from 'components/swipes-ui/FloatingInput';

export default class Signin extends Component {
  constructor(props) {
    super(props);
    this.signin = this.signin.bind(this);
    this.state = {
      email: '',
      password: '',
    };
    this.cachedOnChange = setupCachedCallback(this.onChange, this);
  }
  onChange(key, value) {
    if (this.props.loading) {
      return;
    }
    this.setState({ [key]: value });
  }
  signin() {
    const {
      email,
      password,
    } = this.state;

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
    const { errorLabel, loading } = this.props;
    const {
      email,
      password,
    } = this.state;
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
          value={email}
          onChange={this.cachedOnChange('email')}
          error={!!errorLabel}
        />
        <FloatingInput
          label="Password"
          type="password"
          id="password"
          value={password}
          onChange={this.cachedOnChange('password')}
          error={!!errorLabel}
        />
        <br />
        <div className="sign__error-status">{errorLabel}</div>
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
  errorLabel: string,
  loading: bool,
};
