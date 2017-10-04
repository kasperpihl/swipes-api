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

class HOCCompatibleLogin extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      formData: Map(),
    };
    setupLoading(this);
  }
  componentDidMount() {
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

          if (label === "!body /users.signin: Invalid object['email']: did not match format") {
            label = '!Not a valid email';
          }
        }

        this.clearLoading('signInButton', label);
      } else {
        setUrl('/')
        window.analytics.sendEvent('Logged in', {});
        this.clearLoading('signInButton');
      }
    });
  }
  onResetPassword(e) {
    e.preventDefault();
    const { request, inputMenu, isElectron, confirm } = this.props;
    const { formData } = this.state;

    if(isElectron) {
      const options = { boundingRect: e.target.getBoundingClientRect() };
      inputMenu({
        ...options,
        placeholder: 'Email',
        text: formData.get('email'),
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
    } else {
      const result = window.prompt('Enter your email to reset your password', 'Your email');
      if(!result) return false;
      request('me.sendResetEmail', { email: result }).then((res) => {
        window.alert('We will send you an email to change your password.');
      });
    }
      
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

const mapStateToProps = (state) => ({
  isElectron: state.getIn(['globals', 'isElectron']),
});

export default connect(mapStateToProps, {
  inputMenu: a.menus.input,
  confirm: a.menus.confirm,
  request: ca.api.request,
  setUrl: a.navigation.url,
})(HOCCompatibleLogin);
