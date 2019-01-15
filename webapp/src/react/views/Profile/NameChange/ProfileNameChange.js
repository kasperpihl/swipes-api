import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { setupLoading } from 'swipes-core-js/classes/utils';
import Button from 'src/react/components/button/Button';
import SW from './ProfileNameChange.swiss.js';

import request from 'swipes-core-js/utils/request';

@connect(state => ({
  me: state.me
}))
export default class ProfileNameChange extends PureComponent {
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
  handleSave = () => {
    const { me } = this.props;
    const { firstName, lastName } = this.state;

    if (
      firstName !== me.get('first_name') ||
      lastName !== me.get('last_name')
    ) {
      this.setLoading('button');
      request('me.updateProfile', {
        first_name: firstName,
        last_name: lastName
      }).then(res => {
        if (res && res.ok) {
          this.clearLoading('button', 'success', 1500);
        } else {
          this.clearLoading('button', '!Something went wrong');
        }
      });
    }
  };
  render() {
    return (
      <SW.Wrapper>
        <SW.Input
          type="text"
          placeholder="First Name"
          value={this.state.firstName}
          onChange={this.handleChangeCached('firstName')}
        />
        <SW.Input
          type="text"
          placeholder="Last Name"
          value={this.state.lastName}
          onChange={this.handleChangeCached('lastName')}
        />
        <Button
          title="Update"
          onClick={this.handleSave}
          {...this.getLoading('button')}
        />
      </SW.Wrapper>
    );
  }
}
