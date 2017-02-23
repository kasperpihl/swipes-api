import React, { Component, PropTypes } from 'react';
import { browserHistory } from 'react-router';
import { connect } from 'react-redux';
import { api } from 'actions';
import { setupCachedCallback, bindAll } from 'classes/utils';
import Gradient from 'components/gradient/Gradient';
import Topbar from 'src/react/app/topbar/Topbar';
import SWView from 'SWView';
import TabBar from 'components/tab-bar/TabBar';
import FloatingInput from 'components/swipes-ui/FloatingInput';
import Icon from 'Icon';
import Button from 'Button';

import './registration.scss';

class HOCRegistration extends Component {
  constructor(props) {
    super(props);
    this.state = {
      errorLabel: null,
      tabIndex: 0,
      signinEmail: '',
      signinPassword: '',
      signupFirstName: '',
      signupLastName: '',
      signupEmail: '',
      signupPassword: '',
      signupInvCode: '',
    };
    this.cachedOnChange = setupCachedCallback(this.onChange, this);
    bindAll(this, ['signin', 'signup', 'handleButtonClick', 'handleKeyDown']);
  }
  componentDidUpdate() {
    const { token } = this.props;

    if (token) {
      browserHistory.push('/');
    }
  }
  onChange(key, value) {
    const { loading } = this.state;

    if (loading) {
      return;
    }

    this.setState({ [key]: value });
  }
  tabDidChange(el, index) {
    const { tabIndex } = this.state;

    if (index !== tabIndex) {
      this.setState({ tabIndex: index });
    }
  }
  handleKeyDown(e) {
    if (e.keyCode === 13) {
      this.handleButtonClick();
    }
  }
  handleButtonClick() {
    const {
      tabIndex,
      signinEmail,
      signinPassword,
      signupFirstName,
      signupLastName,
      signupEmail,
      signupPassword,
      signupInvCode,
   } = this.state;

    if (tabIndex === 0) {
      const email = signinEmail;
      const password = signinPassword;

      const data = {
        email,
        password,
      };

      this.signin(data);
    } else {
      const first_name = signupFirstName;
      const last_name = signupLastName;
      const email = signupEmail;
      const password = signupPassword;
      const invitation_code = signupInvCode;

      const data = {
        first_name,
        last_name,
        email,
        password,
        invitation_code,
      };

      this.signup(data);
    }
  }
  signin(data) {
    this.signinOrUp('users.signin', data);
  }
  signup(data) {
    this.signinOrUp('users.signup', data);
  }
  signinOrUp(endpoint, data) {
    if (this.state.err !== null) {
      this.setState({ errorLabel: null });
    }
    this.props.request(endpoint, data).then((res) => {
      if (!res.ok) {
        let label = 'Something went wrong :/';

        if (res.err === "body /users.signup: Invalid object['invitation_code']: Invalid invitation code") {
          label = 'Invalid invitation code';
        }
        if (res.err === "body /users.signup: Invalid object['email']: did not match format") {
          label = 'Not a valid email';
        }
        this.setState({ errorLabel: label });
      } else {
        const event = endpoint === 'users.signup' ? 'Signed up' : 'Signed in';
        window.analytics.sendEvent(event);
      }
    });
  }
  renderHeader() {
    return (
      <div className="sign-in__header">
        <div className="sign-in__logo">
          <Icon svg="SwipesLogoText" className="sign-in__svg" />
        </div>

        <div className="sign-in__title">Welcome to your workspace</div>
        <div
          className="sign-in__subtitle"
        >
          The place where you join your team on the mission of creating great work together.
        </div>
        {this.renderTabs()}
      </div>
    );
  }
  renderTabs() {
    const { tabIndex } = this.state;
    const tabs = ['Sign in', 'Sign up'];

    return <TabBar tabs={tabs} activeTab={tabIndex} delegate={this} />;
  }
  renderContent() {
    const { tabIndex } = this.state;

    return (
      <div className="sign-in__content">
        {tabIndex === 0 ? this.renderSignin() : this.renderSignup()}
      </div>
    );
  }
  renderSignin() {
    const {
      errorLabel,
      signinEmail,
      signinPassword,
    } = this.state;

    return (
      <div className="sign-in__form">
        <FloatingInput
          label="Email"
          type="email"
          id="email"
          key="signinEmail"
          value={signinEmail}
          onChange={this.cachedOnChange('signinEmail')}
          error={!!errorLabel}
        />
        <FloatingInput
          label="Password"
          type="password"
          id="password"
          key="signinPassword"
          value={signinPassword}
          onChange={this.cachedOnChange('signinPassword')}
          onKeyDown={this.handleKeyDown}
          error={!!errorLabel}
        />
        <div className="sign-in__error-status">{errorLabel}</div>
      </div>
    );
  }
  renderSignup() {
    const {
      errorLabel,
      signupFirstName,
      signupLastName,
      signupEmail,
      signupPassword,
      signupInvCode,
    } = this.state;

    return (
      <div className="sign-in__form">
        <FloatingInput
          label="Your First Name"
          type="text"
          id="firstname"
          key="signupFirstName"
          value={signupFirstName}
          onChange={this.cachedOnChange('signupFirstName')}
          error={!!errorLabel}
        />
        <FloatingInput
          label="Your Last Name"
          type="text"
          id="lastname"
          key="signupLastName"
          value={signupLastName}
          onChange={this.cachedOnChange('signupLastName')}
          error={!!errorLabel}
        />
        <FloatingInput
          label="Email"
          type="email"
          id="email"
          key="signupEmail"
          value={signupEmail}
          onChange={this.cachedOnChange('signupEmail')}
          error={!!errorLabel}
        />
        <FloatingInput
          label="Password"
          type="password"
          id="password"
          key="signupPassword"
          value={signupPassword}
          onChange={this.cachedOnChange('signupPassword')}
          error={!!errorLabel}
        />
        <FloatingInput
          label="Invitation Code"
          type="text"
          id="invitation"
          key="signupInvCode"
          value={signupInvCode}
          onChange={this.cachedOnChange('signupInvCode')}
          error={!!errorLabel}
        />
        <div className="sign-in__error-status">{errorLabel}</div>
      </div>
    );
  }
  renderFooter() {
    const { tabIndex, loading } = this.state;

    return (
      <div className="sign-in__footer">
        <Button primary text={tabIndex === 0 ? 'Sign in' : 'Sign up'} loading={loading} onClick={this.handleButtonClick} />
      </div>
    );
  }
  render() {
    return (
      <div className="sign-in">
        <Gradient />
        <Topbar />
        <div className="sign-in__card">
          <SWView header={this.renderHeader()} footer={this.renderFooter()}>
            {this.renderContent()}
          </SWView>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    token: state.getIn(['main', 'token']),
  };
}

const { string, func, object } = PropTypes;

HOCRegistration.propTypes = {
  token: string,
  request: func,
  route: object,
};

const ConnectedHOCRegistration = connect(mapStateToProps, {
  request: api.request,
})(HOCRegistration);
export default ConnectedHOCRegistration;
