import React, { PureComponent } from 'react';
import { setupDelegate } from 'react-delegate';

import Icon from 'Icon';
import FloatingInput from 'compatible/components/input/FloatingInput';
import CompatibleHeader from 'compatible/components/header/CompatibleHeader';
import CompatibleButton from 'compatible/components/button/CompatibleButton';
import { Link } from 'react-router-dom';
import './styles/signup.scss';

class CompatibleSignup extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
    setupDelegate(this, 'onSignup', 'onNavigateToLogin');
    this.handleKeyDown = this.handleKeyDown.bind(this);
  }
  handleKeyDown(e) {
    if (e.keyCode === 13) {
      this.onSignup();
    }
  }
  getSubtitle() {
    const { organization } = this.props;

    if (!organization) {
      return 'In the Workspace, you unite the work of your team. Start your 14-day free trial by signing up. No credit card required. ';
    }

    return 'Your team is waiting for you. Sign up to join them.';
  }
  generateTitle() {
    const { organization, inviter } = this.props;

    if (!organization) {
      return 'Get Started';
    }

    return `Join ${msgGen.users.getFirstName(inviter)} and the ${organization.get('name')} team`;
  }
  renderHeader() {
    const { inviter } = this.props;
    
    return ([
      <CompatibleHeader center title={this.generateTitle()} assignee={inviter} key="title" />,
      <Icon icon="ESMilestoneAchieved" className="compatible-signup__illustration" key="illustration" />, 
      <CompatibleHeader subtitle={this.getSubtitle()} key="subtitle" />
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
        {this.renderInputField('firstName', 'text', 'First name')}
        {this.renderInputField('lastName', 'text', 'Last name')}
        {this.renderInputField('password', 'password', 'Password', { onKeyDown: this.handleKeyDown })}
      </div>
    );
  }
  renderFormError() {
    const { getLoading } = this.props;

    return (
      <div className="footer__error-label">{getLoading('signupButton').error}</div>
    )
  }
  renderFooter() {
    const { inviter, isLoading, getLoading } = this.props;

    return (
      <div className="footer">
        {getLoading('signupButton').error && this.renderFormError()}
        <CompatibleButton title="Sign up" onClick={this.onSignup} {...getLoading('signupButton')}/>
        <p className="footer__switch">
          Already have an account? <Link to="/login" className="footer__switch-button">Sign in here</Link>
        </p>
        <div className="footer__sentence">
          By signing up you agree to the <a target="_blank" href="http://swipesapp.com/workspacepolicies.pdf">Terms of service</a>
        </div>
      </div>
    );
  }
  render() {
    return (
      <div className="compatible-signup">
        {this.renderHeader()}
        {this.renderForm()}
        {this.renderFooter()}
      </div>
    );
  }
}

export default CompatibleSignup;
