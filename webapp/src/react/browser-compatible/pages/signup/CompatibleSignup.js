import React, { PureComponent } from 'react';
import { setupDelegate } from 'react-delegate';
import CompatibleHeader from 'compatible/components/header/CompatibleHeader';
import CompatibleButton from 'compatible/components/button/CompatibleButton';
import SW from './CompatibleSignup.swiss';

class CompatibleSignup extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
    setupDelegate(this, 'onChange', 'onSignup', 'onNavigateToLogin');
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

    return `Join ${msgGen.users.getFirstName(
      inviter
    )} and the ${organization.get('name')} team`;
  }
  renderHeader() {
    const { inviter } = this.props;

    return [
      <CompatibleHeader
        center
        title={this.generateTitle()}
        assignee={inviter}
        key="title"
      />,
      <SW.Illustration icon="ESMilestoneAchieved" key="illustration" />,
      <CompatibleHeader subtitle={this.getSubtitle()} key="subtitle" />,
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
        onChange={(e) => {
          this.onChange(key, e.target.value);
        }}
      />
    );
  }
  renderForm() {
    return (
      <SW.Form>
        {this.renderInputField('email', 'email', 'Email', {
          autoFocus: true,
          autoComplete: 'email',
        })}
        {this.renderInputField('firstName', 'text', 'First name', {
          autoComplete: 'given-name',
        })}
        {this.renderInputField('lastName', 'text', 'Last name', {
          autoComplete: 'family-name',
        })}
        {this.renderInputField('password', 'password', 'Password', {
          onKeyDown: this.handleKeyDown,
        })}
      </SW.Form>
    );
  }
  renderFormError() {
    const { getLoading } = this.props;

    return <SW.ErrorLabel>{getLoading('signupButton').error}</SW.ErrorLabel>;
  }
  renderFooter() {
    const { inviter, isLoading, getLoading } = this.props;

    return (
      <SW.Footer>
        {getLoading('signupButton').error && this.renderFormError()}
        <CompatibleButton
          title="Sign up"
          onClick={this.onSignup}
          {...getLoading('signupButton')}
        />
        <SW.Switch>
          Already have an account?{' '}
          <SW.LinkButton to="/login">Sign in here</SW.LinkButton>
        </SW.Switch>
        <SW.FooterSentence>
          By signing up you agree to the{' '}
          <a target="_blank" href="http://swipesapp.com/workspacepolicies.pdf">
            Terms of service
          </a>
        </SW.FooterSentence>
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

export default CompatibleSignup;
