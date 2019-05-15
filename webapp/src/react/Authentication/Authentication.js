import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import * as navigationActions from 'src/redux/navigation/navigationActions';
import { Map } from 'immutable';
import withLoader from 'src/react/_hocs/withLoader';
import request from 'core/utils/request';
import Card from '_shared/Card/Card';
import * as mainActions from 'src/redux/main/mainActions';
import Button from '_shared/Button/Button';
import CardHeader from '_shared/Card/Header/CardHeader';
import InputText from '_shared/Input/Text/InputText';
import SW from './Authentication.swiss';
import FormModal from 'src/react/_components/FormModal/FormModal';
import Modal from 'src/react/_Layout/modal/Modal';
import Spacing from '_shared/Spacing/Spacing';

@withRouter
@withLoader
@connect(
  state => ({
    invitedToTeam: state.invitation.get('invitedToTeam')
  }),
  {
    redirectTo: navigationActions.redirectTo,
    openModal: mainActions.modal,
    navSet: navigationActions.set,
    navReset: navigationActions.reset
  }
)
export default class Authentication extends PureComponent {
  state = {
    formData: Map()
  };
  handleResetPassword = e => {
    const { openModal } = this.props;
    const { formData } = this.state;

    openModal('auth', FormModal, {
      title: 'Reset password',
      inputs: [
        {
          type: 'text',
          placeholder: 'Enter your email',
          autoFocus: true,
          initialValue: formData.get('email') || ''
        }
      ],
      confirmLabel: 'Reset',
      onConfirm: ([email]) => {
        if (email && email.length) {
          request('user.sendResetEmail', {
            email
          }).then(res => {
            let title = 'Password reset';
            let subtitle = 'We will send you an email to change your password.';
            if (res.error) {
              title = 'Password reset error';
              subtitle = res.error;
            }
            openModal('auth', FormModal, {
              title,
              subtitle,
              alert: true
            });
          });
        }
      }
    });
  };
  handleAuthentication = () => {
    const { formData } = this.state;
    const { redirectTo, loader, invitedToTeam, navSet, navReset } = this.props;

    if (loader.check('authButton')) {
      return;
    }

    loader.set('authButton');

    const endpoint = this.isLogin() ? 'user.signin' : 'user.signup';
    const analyticsEvent = this.isLogin() ? 'Logged in' : 'Signed up';

    request(endpoint, {
      ...formData.toJS(),
      timezone_offset: new Date().getTimezoneOffset()
    }).then(res => {
      if (res.ok) {
        loader.clear('authButton');
        window.analytics.sendEvent(analyticsEvent);
        if (!this.isLogin) {
          navSet('left', {
            screenId: 'ProjectList',
            crumbTitle: 'Projects'
          });
        }

        if (!this.isLogin() && !invitedToTeam) {
          redirectTo('/create');
        } else {
          redirectTo('/');
        }
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
    const { invitedToTeam } = this.props;

    if (!invitedToTeam) {
      if (this.isLogin()) {
        return 'Sign in to your account';
      }
      return 'The Workspace is free for personal use, and paid for companies.';
    }

    return `Join ${invitedToTeam.get('name')}.`;
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
        <a
          target="_blank"
          href="https://swipesapp.com/privacy-policy"
          style={{ marginLeft: '4px' }}
        >
          Terms of service
        </a>
      </SW.Switch>
    );
  }
  render() {
    //subtitle={this.getSubtitle()}
    const { loader } = this.props;
    return (
      <Card>
        <Modal side="auth" />
        <Spacing height={36} />
        <CardHeader title="Welcome to Swipes!" subtitle={this.getSubtitle()} />
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
