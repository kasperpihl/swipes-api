import React, { PureComponent } from 'react';
import { setupDelegate } from 'react-delegate';
import { bindAll } from 'swipes-core-js/classes/utils';
import CompatibleHeader from 'src/react/browser-compatible/components/header/CompatibleHeader';
import CompatibleButton from 'src/react/browser-compatible/components/button/CompatibleButton';
import SW from './CompatibleLogin.swiss';

class CompatibleLogin extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};

    setupDelegate(this, 'onSignin', 'onResetPassword', 'onChange');
    bindAll(this, ['handleKeyDown']);
  }

  handleKeyDown(e) {
    if (e.key === 'Enter') {
      this.onSignin();
    }
  }

  renderHeader() {
    const title = 'Welcome to your Workspace';
    const subtitle =
      'This is the place for your team to communicate and create great work together.';

    return [
      <CompatibleHeader title={title} key="title" />,
      <SW.Illustration
        icon="ESWelcome"
        className="compatible-login__illustration"
        key="illus"
      />,
      <CompatibleHeader subtitle={subtitle} key="subtitle" />
    ];
  }
  renderInputField(key, type, placeholder, props) {
    const value = this.props.formData.get(key) || '';

    return (
      <SW.Input
        type={type}
        placeholder={placeholder}
        onKeyDown={this.onKeyDown}
        value={value}
        onChange={e => {
          this.onChange(key, e.target.value);
        }}
      />
    );
  }
  renderForm() {
    return (
      <SW.Form onKeyDown={this.handleKeyDown}>
        {this.renderInputField('email', 'email', 'Email', {
          autoFocus: true,
          autoComplete: 'email'
        })}
        {this.renderInputField('password', 'password', 'Password')}
      </SW.Form>
    );
  }
  renderFormError() {
    const { getLoading } = this.props;

    return <SW.ErrorLabel>{getLoading('signInButton').error}</SW.ErrorLabel>;
  }
  renderFooter() {
    const { getLoading } = this.props;

    return (
      <SW.Footer>
        {getLoading('signInButton').error && this.renderFormError()}
        <CompatibleButton
          title="Log in"
          onClick={this.onSignin}
          {...getLoading('signInButton')}
        />
        <SW.Switch>
          Don't have an account yet?{' '}
          <SW.SwitchLink to="/register">Sign up now</SW.SwitchLink>
        </SW.Switch>
        <SW.ResetPassword>
          <a href="" onClick={this.onResetPassword}>
            Reset password
          </a>
        </SW.ResetPassword>
      </SW.Footer>
    );
  }
  render() {
    return (
      <SW.Wrapper>
        {this.renderHeader()}
        {this.renderForm()}
        {this.renderFooter()}
      </SW.Wrapper>
    );
  }
}

export default CompatibleLogin;
