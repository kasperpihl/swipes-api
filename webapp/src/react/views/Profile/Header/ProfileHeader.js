import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { setupLoading } from 'swipes-core-js/classes/utils';
import request from 'swipes-core-js/utils/request';

import SW from './ProfileHeader.swiss';

@connect(state => ({
  me: state.me,
  auth: state.auth
}))
export default class ProfileHeader extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      firstName: props.me.get('first_name') || '',
      lastName: props.me.get('last_name') || ''
    };
    setupLoading(this);
  }
  getKeyForServer(key) {
    switch (key) {
      case 'firstName':
        return 'first_name';
      case 'lastName':
        return 'last_name';
      default:
        return key;
    }
  }
  handleChangeCached = key => e => {
    this.setState({ [key]: e.target.value });
  };
  handleBlurCached = key => e => {
    const { me } = this.props;
    const value = this.state[key];
    const serverKey = this.getKeyForServer(key);
    const orgVal = me.get(serverKey);
    if (value !== orgVal) {
      this.setLoading(key);
      request('me.updateProfile', { [serverKey]: value }).then(res => {
        if (res && res.ok) {
          this.clearLoading(key, 'success', 1500);
        } else {
          this.clearLoading(key, '!Something went wrong');
        }
      });
    }
  };

  handleProfileChange = () => {
    const { auth } = this.props;
    const file = e.target.files[0];
    if (!file) {
      return;
    }
    const formData = new FormData();
    formData.append('token', auth.get('token'));
    formData.append('photo', file);
    this.setLoading('uploadImage');
    request(
      {
        command: 'me.uploadProfilePhoto',
        formData: true
      },
      {
        photo
      }
    ).then(res => {
      this.clearLoading('uploadImage');
      if (res.ok) {
        window.analytics.sendEvent('Profile photo updated', {});
      }
    });
  };
  render() {
    return (
      <SW.Wrapper>
        <input
          type="text"
          placeholder="First name"
          value={this.state.firstName}
          onChange={this.handleChangeCached('firstName')}
        />
        <input
          type="text"
          placeholder="Last name"
          value={this.state.lastName}
          onChange={this.handleChangeCached('lastName')}
        />
      </SW.Wrapper>
    );
  }
}
