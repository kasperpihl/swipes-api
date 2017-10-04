import React, { PureComponent } from 'react';
// import PropTypes from 'prop-types';
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
    bindAll(this, ['handleKeyDown', 'handleReset']);
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
      this.onSignin();
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
    return (
      <div className="form">
        {this.renderInputField('email', 'email', 'Email')}
        {this.renderInputField('password', 'password', 'Password', { onKeyDown: this.handleKeyDown })}
      </div>
    )
  }
  renderFooter() {
    const { getLoading } = this.props;

    return (
      <div className="footer">
        <CompatibleButton title="Log in" onClick={this.onSignin} {...getLoading('signInButton')}/>
        <p className="footer__switch">
          Don't have an account yet? <Link to="/register" className="footer__switch-button">Sign up now</Link>
        </p>
        <div className="footer__reset-password">
          <a href="" onClick={this.handleReset}>Reset password</a>
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
