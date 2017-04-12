import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import * as ca from 'swipes-core-js/actions';
import { setupCachedCallback, bindAll } from 'swipes-core-js/classes/utils';
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
    bindAll(this, ['signin', 'handleContinue', 'handleButtonClick', 'handleKeyDown']);
  }
  componentDidUpdate() {
    const { token, isHydrated, history } = this.props;

    if (isHydrated && token) {
      history.push('/');
    }
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

    this.signin(data);
  }
  signin(data) {
    const { history } = this.props;
    history.push('/');
    return;
    this.signinOrUp('users.signin', data);
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
      <div className="welcome__header">
        <div className="welcome__logo">
          <Icon icon="SwipesLogoFull" className="welcome__svg" />
        </div>
      </div>
    );
  }
  renderContent() {
    const { email, password, errorLabel, showWelcomeMessage } = this.state;

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
    let resetClass = 'welcome__reset';
    let continueClass = 'welcome__continue';

    if (!showWelcomeMessage) {
      resetClass += ' welcome__reset--show';
      continueClass += ' welcome__continue--sign-in';
    } else {
      continueClass += ' welcome__continue--continue';
    }

    return (
      <div className="welcome__footer">
        <div className="welcome__actions welcome__actions--reset">
          <div className={resetClass}>Reset my password</div>
        </div>
        <div className="welcome__actions welcome__actions--continue" onClick={this.handleContinue}>
          <div
            className={continueClass}
            data-title="Take me to my Workspace"
          >
            Let’s get started
          </div>
          <div className="welcome__icon">
            <Icon icon="ArrowRightLong" className="welcome__svg" />
          </div>
        </div>
      </div>
    );
  }
  render() {
    return (
      <div className="welcome__card">
        <SWView header={this.renderHeader()} footer={this.renderFooter()}>
          {this.renderContent()}
        </SWView>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    status: state.getIn(['connection', 'status']),
    token: state.getIn(['connection', 'token']),
    isHydrated: state.getIn(['main', 'isHydrated']),
  };
}

const { string, func, bool } = PropTypes;

HOCRegistration.propTypes = {
  token: string,
  request: func,
  isHydrated: bool,
};

export default withRouter(connect(mapStateToProps, {
  request: ca.api.request,
})(HOCRegistration));
