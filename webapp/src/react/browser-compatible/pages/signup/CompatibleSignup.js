import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import * as navigationActions from 'src/redux/navigation/navigationActions';
import { Map } from 'immutable';
import { setupLoading } from 'swipes-core-js/classes/utils';
import request from 'swipes-core-js/utils/request';
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
    setupLoading(this);
  }
  handleSignup() {
    const { formData } = this.state;
    const { setUrl, invitedToOrg } = this.props;

    if (this.isLoading('signupButton')) {
      return;
    }

    this.setLoading('signupButton');
    request('user.signup', {
      ...formData.toJS(),
      invitation_token: !!invitedToOrg && invitedToOrg.get('token')
    }).then(res => {
      if (res.ok) {
        this.clearLoading('signupButton');
        window.analytics.sendEvent('Signed up', {});
        if (invitedToOrg) {
          window.analytics.sendEvent('Invitation accepted', {
            distinct_id: me.get('invited_by')
            // 'Minutes since invite':
          });
        }
        setUrl('/');
      } else {
        let label = '!Something went wrong :/';

        if (res.error && res.error.message) {
          label = '!' + res.error.message;

          if (label.startsWith('!body /users.signup: Invalid object')) {
            let invalidProp = label
              .split('[')[1]
              .split(']')[0]
              .replace("'", '')
              .replace("'", '');

            label = `!Not a valid ${invalidProp}`;
          }
        }

        this.clearLoading('signupButton', label);
      }
    });
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

    return 'Signup to Swipes Workspace and join your team.';
  }
  generateTitle() {
    const { invitedToOrg } = this.props;

    if (!invitedToOrg) {
      return 'Get Started';
    }

    return `Join ${invitedToOrg.get('name')}`;
  }
  renderInputs() {
    return (
      <>
        <SW.Input
          value={this.state.formData.get('email') || ''}
          onChange={this.handleChangeCached('email')}
          autoFocus
          autoComplete="email"
          placeholder="Email"
          type="email"
        />
        <SW.Input
          value={this.state.formData.get('first_name') || ''}
          onChange={this.handleChangeCached('first_name')}
          autoComplete="given-name"
          placeholder="First name"
          type="text"
        />
        <SW.Input
          value={this.state.formData.get('last_name') || ''}
          onChange={this.handleChangeCached('last_name')}
          autoComplete="family-name"
          placeholder="Last name"
          type="type"
        />
        <SW.Input
          value={this.state.formData.get('password') || ''}
          onChange={this.handleChangeCached('password')}
          onKeyDown={this.handleKeyDown}
          placeholder="Password"
          type="password"
        />
      </>
    );
  }
  renderSwitch() {
    return (
      <SW.Switch>
        {this.isLogin()
          ? 'New to the Workspace? '
          : 'Already have an account? '}
        <SW.LinkButton to="/login">Sign in here</SW.LinkButton>
      </SW.Switch>
    );
  }
  render() {
    return (
      <CompatibleCard>
        <SW.Wrapper>
          <CompatibleHeader
            center
            title={this.generateTitle()}
            subtitle={this.getSubtitle()}
          />
          <SW.Form>
            {this.renderInputs()}
            {this.getLoading('signupButton').error && (
              <SW.ErrorLabel>
                {this.getLoading('signupButton').error}
              </SW.ErrorLabel>
            )}
            <SW.SubmitWrapper>
              <Button
                rounded
                title="Create account"
                onClick={this.handleSignup}
                {...this.getLoading('signupButton')}
              />
              {this.renderSwitch()}
            </SW.SubmitWrapper>
          </SW.Form>

          <SW.Footer>
            By signing up you agree to the{' '}
            <a
              target="_blank"
              href="http://swipesapp.com/workspacepolicies.pdf"
            >
              Terms of service
            </a>
          </SW.Footer>
        </SW.Wrapper>
      </CompatibleCard>
    );
  }
}

export default CompatibleSignup;
