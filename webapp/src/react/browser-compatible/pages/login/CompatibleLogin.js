import React, { PureComponent } from 'react';
// import PropTypes from 'prop-types';
import { setupDelegate } from 'react-delegate';
import Icon from 'Icon';
import FloatingInput from 'compatible/components/input/FloatingInput';
import CompatibleHeader from 'compatible/components/header/CompatibleHeader'
import './styles/login.scss';

class CompatibleLogin extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};

    setupDelegate(this, 'onSignin', 'onResetPassword');
    this.handleKeyDown = this.handleKeyDown.bind(this);
  }
  componentDidMount() {
  }
  handleReset(e) {
    e.preventDefault();
    const result = window.prompt('Enter your email to reset your password', 'Your email');

    if (result) {
      this.onResetPassword(result);
    }

    return false;
  }
  handleKeyDown(e) {
    if (e.keyCode === 13) {
      this.onSignup();
    }
  }
  renderHeader() {
    const { inviter } = this.props;
    const title = 'This is a title';
    const subtitle = 'This is a subtitle';
    
    return (
      <CompatibleHeader title={title} subtitle={subtitle} />
    )
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
    <div className="form">
      {this.renderInputField('email', 'email', 'Email')}
      {this.renderInputField('password', 'password', 'Password', { onKeyDown: this.handleKeyDown })}
    </div>
  }
  renderFooter() {
    const isLoading = this.props.getLoading('signinButton').loading;

    return (
      <div className="footer">
        <a className="footer__button" ref="button" onClick={this.onSignin}>
          {
            isLoading ? (
              <Icon icon="loader" width="12" height="12" />
            ) : (
              'Sign in'
            )
          }
        </a>

        <a href="" className="footer__reset-password" onClick={this.handleReset} >Reset password</a>
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
