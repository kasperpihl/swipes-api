import React, { PureComponent } from 'react';

import { setupDelegate } from 'react-delegate';
import { bindAll } from 'swipes-core-js/classes/utils';
import Icon from 'Icon';
import FloatingInput from 'compatible/components/input/FloatingInput';
import CompatibleHeader from 'compatible/components/header/CompatibleHeader';
import CompatibleButton from 'compatible/components/button/CompatibleButton';
import { Link } from 'react-router-dom';
import './styles/login.scss';

class CompatibleLogin extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};

    setupDelegate(this, 'onSignin', 'onResetPassword');
    bindAll(this, ['handleKeyDown']);
  }
  handleKeyDown(e) {
    if (e.keyCode === 13) {
      this.onSignin();
    }
  }
  renderHeader() {
    const { inviter } = this.props;
    const title = 'Welcome to your Workspace';
    const subtitle = 'This is the place for your team to communicate and create great work together.';
    
    return ([
      <CompatibleHeader title={title} key="title"/>,
      <Icon icon="ESWelcome" className="compatible-login__illustration" key="illus"/>,
      <CompatibleHeader subtitle={subtitle} key="subtitle"/>
    ])
  }
  renderInputField(key, type, placeholder, props) {
    const { delegate } = this.props;
    const value = this.props.formData.get(key) || '';

    return (
      <FloatingInput
        key={key}
        inputKey={key}
        type={type}
        placeholder={placeholder}
        delegate={delegate}
        value={value}
        props={props}
      />
    );
  }
  renderForm() {
    return (
      <div className="form">
        {this.renderInputField('email', 'email', 'Email', { autoFocus: true })}
        {this.renderInputField('password', 'password', 'Password', { onKeyDown: this.handleKeyDown })}
      </div>
    )
  }
  renderFormError() {
    const { getLoading } = this.props;

    return (
      <div className="footer__error-label">{getLoading('signInButton').error}</div>
    )
  }
  renderFooter() {
    const { isLoading, getLoading } = this.props;

    return (
      <div className="footer">
        {getLoading('signInButton').error && this.renderFormError()}
        <CompatibleButton title="Log in" onClick={this.onSignin} {...getLoading('signInButton')}/>
        <p className="footer__switch">
          Don't have an account yet? <Link to="/register" className="footer__switch-button">Sign up now</Link>
        </p>
        <div className="footer__reset-password">
          <a href="" onClick={this.onResetPassword}>Reset password</a>
        </div>
      </div>
    );
  }
  render() {
    return (
      <div className="compatible-login">
        {this.renderHeader()}
        {this.renderForm()}
        {this.renderFooter()}
      </div>
    );
  }
}

export default CompatibleLogin

// const { string } = PropTypes;

CompatibleLogin.propTypes = {};
