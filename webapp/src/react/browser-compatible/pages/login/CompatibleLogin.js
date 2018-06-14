import React, { PureComponent } from 'react';
import { setupDelegate } from 'react-delegate';
import { bindAll } from 'swipes-core-js/classes/utils';
import FloatingInput from 'compatible/components/input/FloatingInput';
import CompatibleHeader from 'compatible/components/header/CompatibleHeader';
import CompatibleButton from 'compatible/components/button/CompatibleButton';
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
    const { inviter } = this.props;
    const title = 'Welcome to your Workspace';
    const subtitle = 'This is the place for your team to communicate and create great work together.';

    return ([
      <CompatibleHeader title={title} key="title"/>,
      <SW.Illustration icon="ESWelcome" className="compatible-login__illustration" key="illus"/>,
      <CompatibleHeader subtitle={subtitle} key="subtitle"/>
    ])
  }
  renderInputField(key, type, placeholder, props) {
    const { delegate, onKeyDown } = this.props;
    const value = this.props.formData.get(key) || '';

    return (
      <FloatingInput
        inviteFormField={false}
        key={key}
        inputKey={key}
        type={type}
        placeholder={placeholder}
        onChange={this.onChangeCached(key)}
        value={value}
        props={props}
      />
    );
  }
  renderForm() {
    return (
       <SW.Form onKeyDown={this.handleKeyDown}>
        {this.renderInputField('email', 'email', 'Email', { autoFocus: true })}
        {this.renderInputField('password', 'password', 'Password')}
      </SW.Form>
    )
  }
  renderFormError() {
    const { getLoading } = this.props;

    return (
      <SW.ErrorLabel>{getLoading('signInButton').error}</SW.ErrorLabel>
    )
  }
  renderFooter() {
    const { isLoading, getLoading } = this.props;

    return (
      <SW.Footer>
        {getLoading('signInButton').error && this.renderFormError()}
        <CompatibleButton title="Log in" onClick={this.onSignin} {...getLoading('signInButton')}/>
        <SW.Switch>
          Don't have an account yet? <SW.SwitchLink to="/register">Sign up now</SW.SwitchLink>
        </SW.Switch>
        <ResetPassword>
          <a href="" onClick={this.onResetPassword}>Reset password</a>
        </ResetPassword>
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
