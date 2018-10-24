import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import * as ca from 'swipes-core-js/actions';
import { setupLoading } from 'swipes-core-js/classes/utils';
import navWrapper from 'src/react/app/view-controller/NavWrapper';
import Profile from './Profile';

@navWrapper
@connect(
  state => ({
    me: state.me,
  }),
  {
    updateProfile: ca.me.updateProfile,
    uploadProfilePhoto: ca.me.uploadProfilePhoto,
  }
)
export default class extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      firstName: this.valueForKey('firstName'),
      lastName: this.valueForKey('lastName'),
      role: this.valueForKey('role'),
      bio: this.valueForKey('bio'),
      email: this.valueForKey('email'),
    };

    setupLoading(this);
  }
  valueForKey(key) {
    const { me } = this.props;
    switch (key) {
      case 'firstName':
        return msgGen.users.getFirstName(me);
      case 'lastName':
        return msgGen.users.getLastName(me);
      case 'role':
        return msgGen.users.getRole(me);
      case 'bio':
        return msgGen.users.getBio(me);
      case 'email':
        return msgGen.users.getEmail(me);
      default:
        return '';
    }
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
  onBlur(key) {
    const { updateProfile } = this.props;
    const value = this.state[key];
    const orgVal = this.valueForKey(key);
    if (value !== orgVal) {
      this.setLoading(key);
      const serverKey = this.getKeyForServer(key);
      updateProfile({ [serverKey]: value }).then(res => {
        if (res && res.ok) {
          this.clearLoading(key, 'success', 1500);
        } else {
          this.clearLoading(key, '!Something went wrong');
        }
      });
    }
  }
  onImageChange(e) {
    const { uploadProfilePhoto } = this.props;
    const file = e.target.files[0];
    if (file) {
      this.setLoading('uploadImage');
      uploadProfilePhoto(file).then(res => {
        this.clearLoading('uploadImage');
        if (res.ok) {
          window.analytics.sendEvent('Profile photo updated', {});
        }
      });
    }
  }
  onChange(key, val) {
    this.setState({ [key]: val });
  }
  render() {
    const { me } = this.props;
    const { firstName, lastName, role, bio, email } = this.state;

    return (
      <Profile
        me={me}
        delegate={this}
        {...this.bindLoading()}
        firstName={firstName}
        lastName={lastName}
        role={role}
        bio={bio}
        email={email}
      />
    );
  }
}
