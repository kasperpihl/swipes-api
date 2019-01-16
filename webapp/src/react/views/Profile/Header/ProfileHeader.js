import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { setupLoading } from 'swipes-core-js/classes/utils';
import ProfileNameChange from 'src/react/views/Profile/NameChange/ProfileNameChange';
import UserImage from 'src/react/components/UserImage/UserImage';

import SW from './ProfileHeader.swiss';

import request from 'swipes-core-js/utils/request';
import navWrapper from 'src/react/app/view-controller/NavWrapper';

@navWrapper
@connect(state => ({
  me: state.me,
  auth: state.auth
}))
export default class ProfileHeader extends PureComponent {
  constructor(props) {
    super(props);

    setupLoading(this);
  }
  onImageChange = e => {
    const { uploadProfilePhoto } = this.props;
    const file = e.target.files[0];
    if (file) {
      this.setLoading('uploadImage');
      request(
        { command: 'me.uploadPhoto', formData: true },
        { photo: file }
      ).then(res => {
        this.clearLoading('uploadImage');
        if (res.ok) {
          window.analytics.sendEvent('Profile photo updated', {});
        }
      });
    }
  };
  handleOpenModal = () => {
    const { openModal } = this.props;
    openModal({
      component: ProfileNameChange,
      position: 'center'
    });
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
  handleUpload = () => {
    this.imageUpload.click();
  };
  renderProfileImage() {
    const { me } = this.props;
    const initials = `${me.get('first_name').charAt(0)}${me
      .get('last_name')
      .charAt(0)}`;
    const profilePic = undefined;

    return (
      <SW.ProfileImage>
        <UserImage userId="me" />
        <SW.HeaderFileInput
          className="fileInput"
          onChange={this.onImageChange}
          type="file"
          accept="image/x-png,image/jpeg"
          innerRef={c => (this.imageUpload = c)}
        />
        <SW.ButtonWrapper onClick={this.handleUpload}>
          <SW.OverlaySVG icon="Plus" />
        </SW.ButtonWrapper>
      </SW.ProfileImage>
    );
  }
  render() {
    const { me } = this.props;
    const fullName = `${me.get('first_name')} ${me.get('last_name')}`;
    return (
      <SW.Wrapper>
        {this.renderProfileImage()}
        <SW.NameField onClick={this.handleOpenModal}>{fullName}</SW.NameField>
      </SW.Wrapper>
    );
  }
}
