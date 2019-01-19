import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import withLoader from 'src/react/_hocs/withLoader';
import SW from './ProfileNameChange.swiss.js';

import request from 'swipes-core-js/utils/request';

@connect(state => ({
  me: state.me
}))
@withLoader
export default class ProfileNameChange extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      firstName: props.me.get('first_name') || '',
      lastName: props.me.get('last_name') || ''
    };
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
  handleSave = e => {
    const { me, loader, hideModal } = this.props;
    const { firstName, lastName } = this.state;
    if (loader.check('changeName')) {
      return;
    }

    if (!e.keyCode || e.keyCode === 13) {
      if (
        firstName !== me.get('first_name') ||
        lastName !== me.get('last_name')
      ) {
        loader.set('changeName');
        request('me.updateProfile', {
          first_name: firstName,
          last_name: lastName
        }).then(res => {
          if (res && res.ok) {
            loader.success('changeName', 'Success', 1500, hideModal);
          } else {
            loader.error('changeName', res.error, 2000);
          }
        });
      }
    }
  };
  render() {
    const { loader } = this.props;
    return (
      <SW.Wrapper>
        <SW.Title>Update profile</SW.Title>
        <SW.InputContainer>
          <SW.InputWrapper>
            <SW.InputLabel>First Name</SW.InputLabel>
            <SW.Input
              type="text"
              placeholder="First Name"
              value={this.state.firstName}
              onChange={this.handleChangeCached('firstName')}
              onKeyUp={this.handleSave}
              autoFocus
            />
          </SW.InputWrapper>
          <SW.InputWrapper>
            <SW.InputLabel>Last Name</SW.InputLabel>
            <SW.Input
              type="text"
              placeholder="Last Name"
              value={this.state.lastName}
              onChange={this.handleChangeCached('lastName')}
              onKeyUp={this.handleSave}
            />
          </SW.InputWrapper>
        </SW.InputContainer>
        <SW.Button
          title="Update"
          onClick={this.handleSave}
          {...loader.get('changeName')}
        />
      </SW.Wrapper>
    );
  }
}
