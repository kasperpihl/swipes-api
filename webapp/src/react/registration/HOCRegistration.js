import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import * as a from 'actions';
import * as ca from 'swipes-core-js/actions';
import { setupCachedCallback, bindAll, setupLoading } from 'swipes-core-js/classes/utils';
import SWView from 'SWView';
import Icon from 'Icon';
import Signin from './Signin';
import WelcomeMessage from './WelcomeMessage';

import './styles/registration.scss';

class HOCRegistration extends Component {
  constructor(props) {
    super(props);
    this.state = {
      errorLabel: null,
      email: '',
      password: '',
      showWelcomeMessage: true,
    };
    this.cachedOnChange = setupCachedCallback(this.onChange, this);
    bindAll(this, ['onSignin', 'handleContinue', 'handleButtonClick', 'handleKeyDown', 'onResetPassword']);
    setupLoading(this);
  }
  componentDidMount() {
    window.analytics.sendEvent('Login opened', {});
  }
  onResetPassword(e) {
    const { request, inputMenu, confirm } = this.props;
    const { email } = this.state;
    const options = {
      boundingRect: e.target.getBoundingClientRect(),
    };
    inputMenu({
      ...options,
      placeholder: 'Email',
      text: email,
      buttonLabel: 'Reset',
    }, (resetEmail) => {
      if (resetEmail && resetEmail.length) {
        request('me.sendResetEmail', {
          email: resetEmail,
        }).then((res) => {
          confirm({
            ...options,
            actions: [{ text: 'Okay' }],
            title: 'Reset password',
            message: 'We will send you an email to change your password.',
          });
        });

      }
    });


  }
  handleEmailChange(value) {
    const { loading } = this.state;

    if (loading) {
      return;
    }

    this.setState({ email: value });
  }
  handlePasswordChange(value) {
    const { loading } = this.state;

    if (loading) {
      return;
    }

    this.setState({ password: value });
  }
  handleContinue() {
    const { showWelcomeMessage } = this.state;

    if (showWelcomeMessage) {
      this.setState({ showWelcomeMessage: false });
    } else if (!showWelcomeMessage) {
      this.handleButtonClick();
    }
  }
  handleKeyDown(e) {
    if (e.keyCode === 13) {
      this.handleButtonClick();
    }
  }
  handleButtonClick() {
    const {
      email,
      password,
   } = this.state;

    const data = {
      email,
      password,
    };

    this.onSignin(data);
  }
  onSignin(data) {
    if (this.state.err !== null) {
      this.setState({ errorLabel: null });
    }
    this.setLoading('signInButton');
    this.props.request('users.signin', data).then((res) => {
      if (!res.ok) {
        let label = '!Something went wrong :/';

        if (res.err === "body /users.signup: Invalid object['invitation_code']: Invalid invitation code") {
          label = '!Invalid invitation code';
        }
        if (res.err === "body /users.signup: Invalid object['email']: did not match format") {
          label = '!Not a valid email';
        }
        this.clearLoading('signInButton', label);
      } else {
        window.analytics.sendEvent('Logged in', {});
        this.clearLoading('signInButton');
      }
    });
  }
  renderHeader() {
    const { showWelcomeMessage } = this.state;

    return (
      <div className="welcome__header">
        <div className="welcome__logo">
          <Icon icon="SwipesLogoFull" className="welcome__svg" />
        </div>
        <div className="welcome-message__title">{showWelcomeMessage ? 'Welcome to your Workspace' : 'Sign in to your Workspace'}</div>
      </div>
    );
  }
  renderContent() {
    const { email, password, showWelcomeMessage } = this.state;
    const errorLabel = this.getLoading('signInButton').errorLabel;

    return (
      <div className="welcome__content">
        {showWelcomeMessage ? (
          <WelcomeMessage delegate={this} />
        ) : (
          <Signin email={email} password={password} delegate={this} errorLabel={errorLabel} />
          )}
      </div>
    );
  }
  renderFooter() {
    const { showWelcomeMessage } = this.state;
    const isLoading = this.getLoading('signInButton').loading;
    let resetClass = 'welcome__reset';
    let continueClass = 'welcome__continue';

    if (!showWelcomeMessage) {
      resetClass += ' welcome__reset--show'; // Enable when we have reset password
      continueClass += ' welcome__continue--sign-in';
    } else {
      continueClass += ' welcome__continue--continue';
    }

    return (
      <div className="welcome__footer">
        <div className="welcome__actions welcome__actions--reset" onClick={this.onResetPassword}>
          <div className={resetClass}>Reset my password</div>
        </div>
        <button className="welcome__actions welcome__actions--continue" onClick={this.handleContinue}>
          <div
            className={continueClass}
            data-title="Take me to my Workspace"
          >
            Let’s get started
          </div>

          {
            isLoading ? (
              <svg className="spinner" viewBox="0 0 50 50">
                <circle className="spinner__path" cx="25" cy="25" r="20" fill="none" />
              </svg>
            ) : (
              <div className="welcome__icon">
                <Icon icon="ArrowRightLong" className="welcome__svg" />
              </div>
            )
          }
        </button>
      </div>
    );
  }
  render() {
    return (
      <div className="welcome">
        <div className="welcome__card">
          <SWView header={this.renderHeader()} footer={this.renderFooter()}>
            {this.renderContent()}
          </SWView>
        </div>
      </div>
    );
  }
}

function mapStateToProps() {
  return {};
}

const { func } = PropTypes;

HOCRegistration.propTypes = {
  request: func,
};

export default withRouter(connect(mapStateToProps, {
  request: ca.api.request,
  inputMenu: a.menus.input,
  confirm: a.menus.confirm,
})(HOCRegistration));
