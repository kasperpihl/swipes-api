import React, { PureComponent } from 'react';
import withLoader from 'src/react/_hocs/withLoader';
import urlGetParameter from 'src/utils/url/urlGetParameter';
import request from 'core/utils/request';
import InputText from '_shared/Input/Text/InputText';
import Button from '_shared/Button/Button';
import Spacing from '_shared/Spacing/Spacing';
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
    request('user.verifyResetToken', {
      resetToken: urlGetParameter('token')
    }).then(res => {
      if (res && res.ok) {
        loader.clear('verify');
      } else {
        loader.error('verify', 'This token is no longer valid');
      }
    });
  }
  onKeyDown = e => {
    if (e.keyCode === 13) {
      this.handleReset();
    }
  };
  handleReset = () => {
    const { newPass } = this.state;
    const { loader } = this.props;
    if (!newPass.length) {
      return;
    }
    loader.set('reset');
    request('user.resetPassword', {
      resetToken: urlGetParameter('token'),
      password: newPass
    }).then(res => {
      if (res && res.ok) {
        loader.success('reset', 'Success. Redirecting...', 2000, () => {
          window.location.href = '/login';
        });
      } else {
        loader.error('reset', res.error);
      }
      console.log(res);
    });
  };
  onChange = e => {
    this.setState({ newPass: e.target.value });
  };

  render() {
    const { loader } = this.props;
    const { newPass } = this.state;

    const verify = loader.get('verify');
    if (verify.loading) return null;
    if (verify.error) {
      return <SW.Wrapper>Invalid or expired token.</SW.Wrapper>;
    }
    return (
      <SW.Wrapper>
        <SW.FormTitle>Reset your password</SW.FormTitle>
        <InputText
          type="password"
          className="input-focus"
          placeholder="Your new password"
          onKeyDown={this.onKeyDown}
          value={newPass}
          autoFocus
          onChange={this.onChange}
        />
        <Spacing height={10} />
        <Button
          title="Reset"
          onClick={this.handleReset}
          status={loader.get('reset')}
          green
          right
        />
      </SW.Wrapper>
    );
  }
}
