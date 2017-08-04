import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { setupDelegate } from 'swipes-core-js/classes/utils';
import FloatingInput from 'components/floating-input/FloatingInput';

import './styles/signin.scss';

class Signin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      emailFocus: false,
    };

    setupDelegate(this, 'handleEmailChange', 'handlePasswordChange', 'handleKeyDown');

  }
  componentDidMount() {
    // this.focusInput = setTimeout(() => {
    //   this.setState({ emailFocus: true });
    // }, 1000);
  }
  componentWillUnmount() {
    clearTimeout(this.focusInput);
  }
  render() {
    const { email, password, errorLabel } = this.props;
    const { emailFocus } = this.state;

    return (
      <div className="sign-in">
        <FloatingInput
          ref="emailInput"
          label="Email"
          type="email"
          id="email"
          key="email"
          value={email}
          onChange={this.handleEmailChange}
          onKeyDown={this.handleKeyDown}
          error={!!errorLabel}
          focus={emailFocus}
          autoFocus
        />
        <FloatingInput
          label="Password"
          type="password"
          id="password"
          key="password"
          value={password}
          onChange={this.handlePasswordChange}
          onKeyDown={this.handleKeyDown}
          error={!!errorLabel}
        />
        <div className="sign-in__error-status">{errorLabel}</div>
      </div>
    );
  }
}

export default Signin;

const { string, object } = PropTypes;

Signin.propTypes = {
  email: string,
  password: string,
  errorLabel: string,
  delegate: object,
};
