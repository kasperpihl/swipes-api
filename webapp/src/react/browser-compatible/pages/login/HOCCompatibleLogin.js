import React, { PureComponent } from 'react';
// import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import * as a from 'actions';
import * as ca from 'swipes-core-js/actions';
// import * s from 'selectors';
// import * as cs from 'swipes-core-js/selectors';
import { setupLoading } from 'swipes-core-js/classes/utils';
// import { map, list } from 'react-immutable-proptypes';
import { Map } from 'immutable';
import CompatibleLogin from './CompatibleLogin';
import CompatibleCard from 'compatible/components/card/CompatibleCard';
// import { fromJS } from 'immutable';

class HOCCompatibleLogin extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      formData: Map(),
    };
    setupLoading(this);
  }
  onChange(key, e) {
    const { formData } = this.state;
    this.setState({ formData: formData.set(key, e.target.value) });
  }
  onSignin() {
    const { request, setUrl } = this.props;
    const { formData } = this.state;

    if (this.isLoading('signInButton')) {
      return;
    }
    
    this.setLoading('signInButton');

    request('users.signin', {
      email: formData.get('email'),
      password: formData.get('password')
    }).then((res) => {
      if (!res.ok) {
        let label = '!Something went wrong :/';

        if (res.error && res.error.message) {
          label = '!' + res.error.message;

          if (label.startsWith('!body /users.signin: Invalid object[')) {
            let invalidProp = label.split('[')[1].split(']')[0].replace('\'', '').replace('\'', '');

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
    inputMenu({
      ...options,
      placeholder: 'Enter your email',
      text: formData.get('email'),
      buttonLabel: 'Reset',
    }, (resetEmail) => {
      if (resetEmail && resetEmail.length) {
        request('me.sendResetEmail', {
          email: resetEmail,
        }).then((res) => {
          alert({
            ...options,
            title: 'Reset password',
            message: 'We will send you an email to change your password.',
          });
        });
      }
    });
      
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
// const { string } = PropTypes;

HOCCompatibleLogin.propTypes = {};

const mapStateToProps = (state) => ({});

export default connect(mapStateToProps, {
  inputMenu: a.menus.input,
  alert: a.menus.alert,
  request: ca.api.request,
  setUrl: a.navigation.url,
})(HOCCompatibleLogin);
