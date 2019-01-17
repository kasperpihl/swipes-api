import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import * as navigationActions from 'src/redux/navigation/navigationActions';
import { Map } from 'immutable';
import CompatibleHeader from 'src/react/browser-compatible/components/header/CompatibleHeader';
import Button from 'src/react/components/Button/Button';
import CompatibleCard from 'src/react/browser-compatible/components/card/CompatibleCard';
import SW from './CompatibleSignup.swiss';

@connect(
  state => ({
    invitedToOrg: state.invitation.get('invitedToOrg')
  }),
  {
    setUrl: navigationActions.url
  }
)
class CompatibleSignup extends PureComponent {
  state = {
    formData: Map()
  };
  constructor(props) {
    super(props);
  }
  handleChangeCached = key => {
    this.changeCache = this.changeCache || {};
    if (!this.changeCache[key]) {
      this.changeCache[key] = e => {
        this.setState({
          formData: this.state.formData.set(key, e.target.value)
        });
      };
    }
    return this.changeCache[key];
  };
  handleKeyDown = e => {
    if (e.keyCode === 13) {
      this.onSignup();
    }
  };
  getSubtitle() {
    const { organization } = this.props;

    if (!organization) {
      return 'The workspace is free for personal use, and paid for companies.';
    }

    return 'Your team is waiting for you. Sign up to join them.';
  }
  generateTitle() {
    const { organization, inviter } = this.props;

    if (!organization) {
      return 'Get Started';
    }

    return `Join the ${organization.get('name')}-team`;
  }
  renderFormError() {
    return (
      <SW.ErrorLabel>{this.getLoading('signupButton').error}</SW.ErrorLabel>
    );
  }
  renderFooter() {
    const { inviter, isLoading } = this.props;

    return (
      <SW.Footer>
        {this.getLoading('signupButton').error && this.renderFormError()}
        <Button
          title="Sign up"
          onClick={this.onSignup}
          {...this.getLoading('signupButton')}
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
      <CompatibleCard>
        <SW.Wrapper>
          <CompatibleHeader center title={this.generateTitle()} />
          <SW.Form>
            <SW.Input
              value={this.state.formData.get('email') || ''}
              onChange={this.handleChangeCached('email')}
              autoFocus
              autoComplete="email"
              placeHolder="Email"
              type="email"
            />
            <SW.Input
              value={this.state.formData.get('firstName') || ''}
              onChange={this.handleChangeCached('firstName')}
              autoComplete="given-name"
              placeHolder="First name"
              type="text"
            />
            <SW.Input
              value={this.state.formData.get('lastName') || ''}
              onChange={this.handleChangeCached('lastName')}
              autoComplete="family-name"
              placeHolder="Last name"
              type="type"
            />
            <SW.Input
              value={this.state.formData.get('password') || ''}
              onChange={this.handleChangeCached('password')}
              onKeyDown={this.handleKeyDown}
              placeHolder="Password"
              type="password"
            />
          </SW.Form>
          {this.renderFooter()}
        </SW.Wrapper>
      </CompatibleCard>
    );
  }
}

export default CompatibleSignup;
