import React, { PureComponent } from 'react';

import { connect } from 'react-redux';
import * as menuActions from 'src/redux/menu/menuActions';
import * as navigationActions from 'src/redux/navigation/navigationActions';
import request from 'swipes-core-js/utils/request';
import { setupLoading } from 'swipes-core-js/classes/utils';
import { Map } from 'immutable';
import CompatibleLogin from './CompatibleLogin';
import CompatibleCard from 'compatible/components/card/CompatibleCard';

@connect(
  null,
  {
    inputMenu: menuActions.input,
    alert: menuActions.alert,
    setUrl: navigationActions.url,
  }
)
export default class extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      formData: Map(),
    };
    setupLoading(this);
  }
  onChange(key, value) {
    const { formData } = this.state;
    this.setState({ formData: formData.set(key, value) });
  }
  onSignin() {
    const { setUrl } = this.props;
    const { formData } = this.state;

    if (this.isLoading('signInButton')) {
      return;
    }

    this.setLoading('signInButton');

    request('user.signin', {
      email: formData.get('email'),
      password: formData.get('password'),
    }).then(res => {
      if (!res.ok) {
        let label = '!Something went wrong :/';

        if (res.error && res.error.message) {
          label = '!' + res.error.message;

          if (label.startsWith('!body /users.signin: Invalid object[')) {
            let invalidProp = label
              .split('[')[1]
              .split(']')[0]
              .replace("'", '')
              .replace("'", '');

            label = `!Not a valid ${invalidProp}`;
          }
        }

        this.clearLoading('signInButton', label);
      } else {
        setUrl('/');
        window.analytics.sendEvent('Logged in', {});
        this.clearLoading('signInButton');
      }
    });
  }
  onResetPassword(e) {
    e.preventDefault();
    const { request, inputMenu, alert } = this.props;
    const { formData } = this.state;

    const options = { boundingRect: e.target.getBoundingClientRect() };
    inputMenu(
      {
        ...options,
        placeholder: 'Enter your email',
        text: formData.get('email'),
        buttonLabel: 'Reset',
      },
      resetEmail => {
        if (resetEmail && resetEmail.length) {
          request('me.sendResetEmail', {
            email: resetEmail,
          }).then(res => {
            alert({
              ...options,
              title: 'Reset password',
              message: 'We will send you an email to change your password.',
            });
          });
        }
      }
    );

    return false;
  }
  render() {
    const { formData } = this.state;

    return (
      <CompatibleCard>
        <CompatibleLogin
          delegate={this}
          formData={formData}
          {...this.bindLoading()}
        />
      </CompatibleCard>
    );
  }
}
