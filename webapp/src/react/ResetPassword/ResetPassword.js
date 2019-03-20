import React, { PureComponent } from 'react';
import withLoader from 'src/react/_hocs/withLoader';
import urlGetParameter from 'src/utils/url/urlGetParameter';
import request from 'core/utils/request';
import Icon from 'src/react/_components/Icon/Icon';
import SW from './ResetPassword.swiss';

@withLoader
export default class ResetPassword extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      newPass: ''
    };
  }
  componentWillMount() {
    const { loader } = this.props;
    loader.set('verify');
    request('me.verifyResetToken', {
      resetToken: urlGetParameter('token')
    }).then(res => {
      if (res && res.ok) {
        loader.clear('verify');
      } else {
        loader.clear('verify');
        loader.success('reset', 'This token is no longer valid');
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
    const { loader } = this.props;
    if (!newPass.length) {
      return;
    }
    loader.set('reset');
    request('me.resetPassword', {
      resetToken: urlGetParameter('token'),
      password: newPass
    }).then(res => {
      if (res && res.ok) {
        loader.success(
          'reset',
          'Your password has been reset. Try login again now.'
        );
      } else {
        loader.success('reset', 'Something went wrong');
      }
      console.log(res);
    });
  };
  onChange = e => {
    this.setState({ newPass: e.target.value });
  };
  renderLoading() {
    const { loader } = this.props;
    if (!loader.check('verify')) {
      return undefined;
    }
    return <SW.Loading className="loading">Loading</SW.Loading>;
  }
  renderForm() {
    const { loader } = this.props;
    const success = loader.get('reset').success;
    if (loader.check('verify') || success) {
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
      <InputField
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
    const { loader } = this.props;
    return (
      <SW.Button className="button" ref="button" onClick={this.onReset}>
        {loader.check('reset') ? (
          <Icon icon="loader" width="12" height="12" />
        ) : (
          'Reset'
        )}
      </SW.Button>
    );
  }
  renderSuccess() {
    const { loader } = this.props;
    const success = loader.get('reset').success;
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
