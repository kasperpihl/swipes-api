import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import * as navigationActions from 'src/redux/navigation/navigationActions';
import { Map } from 'immutable';
import withLoader from 'src/react/_hocs/withLoader';
import request from 'core/utils/request';
import Card from '_shared/Card/Card';
import Button from '_shared/Button/Button';
import CardHeader from '_shared/Card/Header/CardHeader';
import InputText from '_shared/Input/Text/InputText';
import SW from './Authentication.swiss';
import Spacing from '_shared/Spacing/Spacing';

@withRouter
@withLoader
@connect(
  state => ({
    invitedToOrg: state.invitation.get('invitedToOrg')
  }),
  {
    redirectTo: navigationActions.redirectTo
  }
)
export default class Authentication extends PureComponent {
  state = {
    formData: Map()
  };
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
    const { redirectTo, loader } = this.props;

    if (loader.check('authButton')) {
      return;
    }

    loader.set('authButton');

    const endpoint = this.isLogin() ? 'user.signin' : 'user.signup';
    const analyticsEvent = this.isLogin() ? 'Logged in' : 'Signed up';

    request(endpoint, {
      ...formData.toJS()
    }).then(res => {
      if (res.ok) {
        loader.clear('authButton');
        window.analytics.sendEvent(analyticsEvent, {});
        redirectTo('/');
      } else {
        loader.error('authButton', res.error, 3000);
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
  handleTabChange = i => {
    const { redirectTo } = this.props;
    if (this.isLogin() && i === 0) {
      redirectTo('/register');
    } else if (!this.isLogin() && i === 1) {
      redirectTo('/login');
    }
  };
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
        <Spacing height={9} />
        <InputText
          value={this.state.formData.get('email') || ''}
          onChange={this.handleChangeCached('email')}
          key={this.isLogin() ? 'login' : 'signup'}
          autoFocus
          autoComplete="email"
          placeholder="Email"
          type="email"
        />
        <Spacing height={9} />
        {!this.isLogin() && (
          <>
            <InputText
              value={this.state.formData.get('first_name') || ''}
              onChange={this.handleChangeCached('first_name')}
              autoComplete="given-name"
              placeholder="First name"
              type="text"
            />
            <Spacing height={9} />
            <InputText
              value={this.state.formData.get('last_name') || ''}
              onChange={this.handleChangeCached('last_name')}
              autoComplete="family-name"
              placeholder="Last name"
              type="type"
            />
          </>
        )}
        <Spacing height={9} />
        <InputText
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
      return;
    }
    return (
      <SW.Switch>
        By signing up you agree to the{'   '}
        <a target="_blank" href="http://swipesapp.com/workspacepolicies.pdf">
          Terms of service
        </a>
      </SW.Switch>
    );
  }
  render() {
    //subtitle={this.getSubtitle()}}
    const { loader } = this.props;
    return (
      <Card>
        <Spacing height={36} />
        <CardHeader title="Welcome to Swipes!" />
        <SW.Wrapper>
          <SW.StyledTabBar
            onChange={this.handleTabChange}
            tabs={['Create account', 'Sign in']}
            value={this.isLogin() ? 1 : 0}
          />
          <Spacing height={45} />
          <SW.Form>
            {this.renderInputs()}
            {loader.get('authButton').error && (
              <SW.ErrorLabel>{loader.get('authButton').error}</SW.ErrorLabel>
            )}
            <SW.SubmitWrapper>
              {this.isLogin() ? (
                <Button
                  title="Reset password"
                  onClick={this.handleResetPassword}
                  border
                />
              ) : null}
              <Button
                title={this.isLogin() ? 'Sign in' : 'Create account'}
                onClick={this.handleAuthentication}
                status={loader.get('authButton')}
                green
              />
            </SW.SubmitWrapper>
          </SW.Form>
        </SW.Wrapper>
        {this.renderSwitch()}
      </Card>
    );
  }
}
