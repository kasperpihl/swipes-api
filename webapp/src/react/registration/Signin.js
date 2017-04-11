import React, { Component, PropTypes } from 'react';
import { setupDelegate } from 'swipes-core-js/classes/utils';
import FloatingInput from 'components/swipes-ui/FloatingInput';

import './styles/signin.scss';

class Signin extends Component {
  constructor(props) {
    super(props);
    this.state = {};

    this.callDelegate = setupDelegate(props.delegate);
    this.onEmailChange = this.onEmailChange.bind(this);
    this.onPasswordChange = this.onPasswordChange.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
  }
  onEmailChange(val) {
    this.callDelegate('handleEmailChange', val);
  }
  onPasswordChange(val) {
    this.callDelegate('handlePasswordChange', val);
  }
  handleKeyDown(e) {
    this.callDelegate('handleKeyDown', e);
  }
  render() {
    const { email, password, errorLabel } = this.props;

    return (
      <div className="sign-in">
        <div className="sign-in__title">Sign in to your Workspace</div>
        <FloatingInput
          label="Email"
          type="email"
          id="email"
          key="email"
          value={email}
          onChange={this.onEmailChange}
          error={!!errorLabel}
        />
        <FloatingInput
          label="Password"
          type="password"
          id="password"
          key="password"
          value={password}
          onChange={this.onPasswordChange}
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
