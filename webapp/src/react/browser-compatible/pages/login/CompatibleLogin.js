import React, { PureComponent } from 'react';
import {styleElement} from 'swiss-react';
import { setupDelegate } from 'react-delegate';
import { bindAll } from 'swipes-core-js/classes/utils';
import Icon from 'Icon';
import FloatingInput from 'compatible/components/input/FloatingInput';
import CompatibleHeader from 'compatible/components/header/CompatibleHeader';
import CompatibleButton from 'compatible/components/button/CompatibleButton';
import { Link } from 'react-router-dom';
import styles from './CompatibleLogin.swiss';

const Wrapper = styleElement('div', styles.Wrapper);
const Form = styleElement('div', styles.Form);
const Footer = styleElement('div', styles.Footer);
const ErrorLabel = styleElement('div', styles.ErrorLabel);
const ResetPassword = styleElement('div', styles.ResetPassword);
const Switch = styleElement('div', styles.Switch);
const SwitchLink = styleElement(Link, styles.SwitchLink);
const Illustration = styleElement(Icon, styles.Illustration);

class CompatibleLogin extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};

    setupDelegate(this, 'onSignin', 'onResetPassword', 'onChange');
    bindAll(this, ['handleKeyDown']);
  }

  handleKeyDown(e) {
    if (e.keyCode === 13) {
      this.onSigninCached();
    }
  }

  renderHeader() {
    const { inviter } = this.props;
    const title = 'Welcome to your Workspace';
    const subtitle = 'This is the place for your team to communicate and create great work together.';

    return ([
      <CompatibleHeader title={title} key="title"/>,
      <Illustration icon="ESWelcome" className="compatible-login__illustration" key="illus"/>,
      <CompatibleHeader subtitle={subtitle} key="subtitle"/>
    ])
  }
  renderInputField(key, type, placeholder, props) {
    const { delegate } = this.props;
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
      <Form>
        {this.renderInputField('email', 'email', 'Email', { autoFocus: true })}
        {this.renderInputField('password', 'password', 'Password', { onKeyDown: this.handleKeyDown })}
      </Form>
    )
  }
  renderFormError() {
    const { getLoading } = this.props;

    return (
      <ErrorLabel>{getLoading('signInButton').error}</ErrorLabel>
    )
  }
  renderFooter() {
    const { isLoading, getLoading } = this.props;

    return (
      <Footer>
        {getLoading('signInButton').error && this.renderFormError()}
        <CompatibleButton title="Log in" onClick={this.onSignin} {...getLoading('signInButton')}/>
        <Switch>
          Don't have an account yet? <SwitchLink to="/register">Sign up now</SwitchLink>
        </Switch>
        <ResetPassword>
          <a href="" onClick={this.onResetPassword}>Reset password</a>
        </ResetPassword>
      </Footer>
    );
  }
  render() {
    return (
      <Wrapper>
        {this.renderHeader()}
        {this.renderForm()}
        {this.renderFooter()}
      </Wrapper>
    );
  }
}

export default CompatibleLogin;
