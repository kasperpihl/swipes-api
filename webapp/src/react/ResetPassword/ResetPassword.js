import React, { PureComponent } from 'react';
import { setupLoading } from 'swipes-core-js/classes/utils';
import urlGetParameter from 'src/utils/url/urlGetParameter';
import request from 'swipes-core-js/utils/request';
import Icon from 'src/react/_components/Icon/Icon';
import SW from './ResetPassword.swiss';

export default class ResetPassword extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      newPass: ''
    };
    setupLoading(this);
  }
  componentWillMount() {
    this.setLoading('verify');
    request('me.verifyResetToken', {
      resetToken: urlGetParameter('token')
    }).then(res => {
      if (res && res.ok) {
        this.clearLoading('verify');
      } else {
        this.clearLoading('verify');
        this.clearLoading('reset', 'This token is no longer valid');
      }
    });
  }
  onKeyDown = e => {
    if (e.keyCode === 13) {
      this.onReset();
    }
  };
  onReset = () => {
    const { newPass } = this.state;
    if (!newPass.length) {
      return;
    }
    this.setLoading('reset');
    request('me.resetPassword', {
      resetToken: urlGetParameter('token'),
      password: newPass
    }).then(res => {
      if (res && res.ok) {
        this.clearLoading(
          'reset',
          'Your password has been reset. Try login again now.'
        );
      } else {
        this.clearLoading('reset', 'Something went wrong');
      }
      console.log(res);
    });
  };
  onChange = e => {
    this.setState({ newPass: e.target.value });
  };
  renderLoading() {
    if (!this.isLoading('verify')) {
      return undefined;
    }
    return <SW.Loading className="loading">Loading</SW.Loading>;
  }
  renderForm() {
    const success = this.getLoading('reset').success;
    if (this.isLoading('verify') || success) {
      return undefined;
    }
    return (
      <SW.Form className="form">
        <SW.FormTitle>Reset your password </SW.FormTitle>
        {this.renderInputField()}
        {this.renderButton()}
      </SW.Form>
    );
  }
  renderInputField() {
    const { newPass } = this.state;

    return (
      <SW.Input
        type="password"
        className="input-focus"
        placeholder="Your new password"
        onKeyDown={this.onKeyDown}
        value={newPass}
        onChange={this.onChange}
      />
    );
  }
  renderButton() {
    return (
      <SW.Button className="button" ref="button" onClick={this.onReset}>
        {this.isLoading('reset') ? (
          <Icon icon="loader" width="12" height="12" />
        ) : (
          'Reset'
        )}
      </SW.Button>
    );
  }
  renderSuccess() {
    const success = this.getLoading('reset').success;
    if (!success) {
      return undefined;
    }
    return <div className="success">{success}</div>;
  }

  render() {
    return (
      <SW.Wrapper className="reset">
        {this.renderLoading()}
        {this.renderForm()}
        {this.renderSuccess()}
      </SW.Wrapper>
    );
  }
}
