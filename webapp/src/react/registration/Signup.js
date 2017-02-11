import React, { Component, PropTypes } from 'react';
import { setupCachedCallback } from 'classes/utils';
import FloatingInput from 'components/swipes-ui/FloatingInput';


export default class Signup extends Component {
  constructor(props) {
    super(props);
    this.signup = this.signup.bind(this);
    this.state = {
      name: '',
      email: '',
      password: '',
      invCode: '',
      organization: '',
    };
    this.cachedOnChange = setupCachedCallback(this.onChange, this);
  }
  onChange(key, value) {
    if (this.props.loading) {
      return;
    }
    this.setState({ [key]: value });
  }
  signup() {
    const {
      name,
      email,
      password,
      organization,
      invCode,
    } = this.state;

    const data = {
      email,
      name,
      password,
      repassword: password,
      invitation_code: invCode,
      organization,
    };

    this.props.onSignup(data);

    return undefined;
  }
  preventSubmit(e) {
    e.preventDefault();
  }
  render() {
    const {
      errorLabel,
    } = this.props;

    const {
      name,
      email,
      password,
      organization,
      invCode,
    } = this.state;

    return (
      <form className="sign__form" action="" onSubmit={this.preventSubmit}>
        <br />
        <FloatingInput
          label="Your Name"
          type="text"
          id="name"
          value={name}
          onChange={this.cachedOnChange('name')}
          error={!!errorLabel}
        />
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
        <FloatingInput
          label="Organization"
          type="text"
          id="organization"
          value={organization}
          onChange={this.cachedOnChange('organization')}
          error={!!errorLabel}
        />
        <FloatingInput
          label="Invitation Code"
          type="text"
          id="invitation"
          value={invCode}
          onChange={this.cachedOnChange('invCode')}
          error={!!errorLabel}
        />
        <br />
        <div className="sign__error-status">{errorLabel}</div>
        <input
          type="submit"
          className="sign__form__button sign__form__button--submit"
          value="SIGN UP"
          onClick={this.signup}
        />
      </form>
    );
  }
}

const { func, bool } = PropTypes;

Signup.propTypes = {
  onSignup: func,
  loading: bool,
};
