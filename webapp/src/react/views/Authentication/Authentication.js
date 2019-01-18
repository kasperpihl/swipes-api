import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import * as navigationActions from 'src/redux/navigation/navigationActions';
import * as menuActions from 'src/redux/menu/menuActions';
import * as invitationActions from 'src/redux/invitation/invitationActions';
import { Map } from 'immutable';
import { setupLoading } from 'swipes-core-js/classes/utils';
import request from 'swipes-core-js/utils/request';
import CompatibleCard from 'src/react/browser-compatible/components/card/CompatibleCard';
import Button from 'src/react/components/Button/Button';
import CardHeader from 'src/react/components/CardHeader/CardHeader';
import SW from './Authentication.swiss';

@withRouter
@connect(
  state => ({
    invitedToOrg: state.invitation.get('invitedToOrg')
  }),
  {
    setUrl: navigationActions.url,
    inputMenu: menuActions.input,
    alert: menuActions.alert,
    invitationClear: invitationActions.clear
  }
)
export default class Authentication extends PureComponent {
  state = {
    formData: Map()
  };
  constructor(props) {
    super(props);
    setupLoading(this);
  }
  handleResetPassword = e => {
    e.preventDefault();
    const { inputMenu, alert } = this.props;
    const { formData } = this.state;

    const options = { boundingRect: e.target.getBoundingClientRect() };
    inputMenu(
      {
        ...options,
        placeholder: 'Enter your email',
        text: formData.get('email') || '',
        buttonLabel: 'Reset'
      },
      resetEmail => {
        if (resetEmail && resetEmail.length) {
          request('user.sendResetEmail', {
            email: resetEmail
          }).then(res => {
            alert({
              ...options,
              title: 'Reset password',
              message: 'We will send you an email to change your password.'
            });
          });
        }
      }
    );

    return false;
  };
  handleAuthentication = () => {
    const { formData } = this.state;
    const { setUrl, invitedToOrg, invitationClear } = this.props;

    if (this.isLoading('authButton')) {
      return;
    }

    this.setLoading('authButton');

    const endpoint = this.isLogin() ? 'user.signin' : 'user.signup';
    const analyticsEvent = this.isLogin() ? 'Logged in' : 'Signed up';

    request(endpoint, {
      ...formData.toJS()
    }).then(res => {
      if (res.ok) {
        this.clearLoading('authButton');
        window.analytics.sendEvent(analyticsEvent, {});
        // if (invitedToOrg && invitedToOrg.get('invited_by_user_id')) {
        //   window.analytics.sendEvent('Invitation accepted', {
        //     distinct_id: invitedToOrg.get('invited_by_user_id')
        //     // 'Minutes since invite':
        //   });
        // }
        setUrl('/');
      } else {
        this.clearLoading('authButton', `!${res.error}`);
      }
    });
  };
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
      this.handleAuthentication();
    }
  };
  isLogin() {
    return this.props.location.pathname === '/login';
  }
  tabDidChange(i) {
    const { setUrl } = this.props;
    if (this.isLogin() && i === 0) {
      setUrl('/register');
    } else if (!this.isLogin() && i === 1) {
      setUrl('/login');
    }
  }
  getSubtitle() {
    const { invitedToOrg } = this.props;

    if (!invitedToOrg) {
      if (this.isLogin()) {
        return 'Sign in to your account';
      }
      return 'The Workspace is free for personal use, and paid for companies.';
    }

    return `Join ${invitedToOrg.get('name')}.`;
  }
  renderInputs() {
    return (
      <>
        <SW.Input
          value={this.state.formData.get('email') || ''}
          onChange={this.handleChangeCached('email')}
          key={this.isLogin() ? 'login' : 'signup'}
          autoFocus
          autoComplete="email"
          placeholder="Email"
          type="email"
        />
        {!this.isLogin() && (
          <>
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
          </>
        )}

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
    if (this.isLogin()) {
      return (
        <SW.Switch>
          Forgot your password?{' '}
          <a href="" onClick={this.handleResetPassword}>
            Reset it here
          </a>
        </SW.Switch>
      );
    }
    return (
      <SW.Switch>
        By signing up you agree to the{' '}
        <a target="_blank" href="http://swipesapp.com/workspacepolicies.pdf">
          Terms of service
        </a>
      </SW.Switch>
    );
  }
  render() {
    return (
      <CompatibleCard>
        <SW.Wrapper>
          <CardHeader title="Swipes Workspace" subtitle={this.getSubtitle()} />
          <SW.StyledTabBar
            delegate={this}
            tabs={['Create account', 'Sign in']}
            activeTab={this.isLogin() ? 1 : 0}
          />
          <SW.Form>
            {this.renderInputs()}
            {this.getLoading('authButton').error && (
              <SW.ErrorLabel>
                {this.getLoading('authButton').error}
              </SW.ErrorLabel>
            )}
            <SW.SubmitWrapper>
              <Button
                rounded
                title={this.isLogin() ? 'Sign in' : 'Create account'}
                onClick={this.handleAuthentication}
                {...this.getLoading('authButton')}
              />
              {this.renderSwitch()}
            </SW.SubmitWrapper>
          </SW.Form>
        </SW.Wrapper>
      </CompatibleCard>
    );
  }
}