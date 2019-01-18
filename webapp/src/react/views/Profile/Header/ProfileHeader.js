import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { setupLoading } from 'swipes-core-js/classes/utils';
import * as mainActions from 'src/redux/main/mainActions';
import ProfileNameChange from 'src/react/views/Profile/NameChange/ProfileNameChange';
import UserImage from 'src/react/components/UserImage/UserImage';
import SW from './ProfileHeader.swiss';

import request from 'swipes-core-js/utils/request';
import navWrapper from 'src/react/app/view-controller/NavWrapper';

@navWrapper
@connect(
  state => ({
    me: state.me,
    auth: state.auth
  }),
  {
    contextMenu: mainActions.contextMenu
  }
)
export default class ProfileHeader extends PureComponent {
  constructor(props) {
    super(props);

    setupLoading(this);
  }

  getOptionsForE = e => {
    return {
      boundingRect: e.target.getBoundingClientRect(),
      alignX: 'right',
      excludeY: true,
      positionY: 12
    };
  };

  openContextMenu = e => {
    const { contextMenu, openModal } = this.props;
    const options = this.getOptionsForE(e);

    contextMenu({
      options,
      component: ProfileContextMenu,
      props: {
        openModal
      }
    });
  };

  handleImageChange = e => {
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

  handleUpload = () => {
    this.imageUpload.click();
  };

  renderProfileImage = () => (
    <SW.ProfileImage>
      <UserImage userId="me" />
      <SW.HeaderFileInput
        className="fileInput"
        onChange={this.handleImageChange}
        type="file"
        accept="image/x-png,image/jpeg"
        innerRef={c => (this.imageUpload = c)}
      />
      <SW.ButtonWrapper onClick={this.handleUpload}>
        <SW.OverlaySVG icon="Plus" />
      </SW.ButtonWrapper>
    </SW.ProfileImage>
  );
  render() {
    const { me } = this.props;
    const fullName = `${me.get('first_name')} ${me.get('last_name')}`;
    return (
      <SW.Wrapper>
        {this.renderProfileImage()}
        <SW.NameField onClick={this.handleOpenModal}>{fullName}</SW.NameField>
        <SW.Button icon="ThreeDots" onClick={this.openContextMenu} rounded />
      </SW.Wrapper>
    );
  }
}
