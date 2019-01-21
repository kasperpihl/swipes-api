import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import withLoader from 'src/react/_hocs/withLoader';
import * as mainActions from 'src/redux/main/mainActions';
import FormModal from 'src/react/components/FormModal/FormModal';
import UserImage from 'src/react/components/UserImage/UserImage';
import SW from './ProfileHeader.swiss';
import ListMenu from 'src/react/components/ListMenu/ListMenu';
import request from 'swipes-core-js/utils/request';
import navWrapper from 'src/react/app/view-controller/NavWrapper';

@navWrapper
@withLoader
@connect(
  state => ({
    me: state.me
  }),
  {
    contextMenu: mainActions.contextMenu
  }
)
export default class ProfileHeader extends PureComponent {
  logout() {
    const { openModal, loader } = this.props;
    openModal(FormModal, {
      title: 'Log out',
      subtitle: 'Do you want to log out?',
      onConfirm: () => {
        loader.set('ThreeDots');
        request('user.signout').then(res => {
          if (res.error) {
            loader.error('ThreeDots', res.error, 3000);
          }
        });
      }
    });
  }
  handleListClick = (i, button) => {
    if (button === 'Log out') {
      this.logout();
    }
  };
  handleThreeDots = e => {
    const { contextMenu } = this.props;

    contextMenu({
      options: {
        boundingRect: e.target.getBoundingClientRect(),
        alignX: 'right',
        excludeY: true,
        positionY: 12
      },
      component: ListMenu,
      props: {
        buttons: ['Log out'],
        onClick: this.handleListClick
      }
    });
  };

  handleImageChange = e => {
    const { loader } = this.props;
    const file = e.target.files[0];
    if (file) {
      loader.set('uploadImage');
      request(
        { command: 'me.uploadPhoto', formData: true },
        { photo: file }
      ).then(res => {
        loader.clear('uploadImage');
        if (res.ok) {
          window.analytics.sendEvent('Profile photo updated', {});
        }
      });
    }
  };
  callbackProfileUpdate = ([first_name, last_name]) => {
    const { me, loader } = this.props;
    if (
      first_name !== me.get('first_name') ||
      last_name !== me.get('last_name')
    ) {
      loader.set('ThreeDots');
      request('me.updateProfile', {
        first_name,
        last_name
      }).then(res => {
        if (res && res.ok) {
          loader.success('ThreeDots', 'Updated', 1500);
        } else {
          loader.error('ThreeDots', res.error, 2000);
        }
      });
    }
  };
  handleOpenProfileUpdate = () => {
    const { openModal, me } = this.props;

    openModal(FormModal, {
      title: 'Update Profile',
      inputs: [
        {
          type: 'text',
          label: 'First name',
          autoFocus: true,
          initialValue: me.get('first_name')
        },
        { type: 'text', label: 'Last name', initialValue: me.get('last_name') }
      ],
      onConfirm: this.callbackProfileUpdate,
      confirmLabel: 'Update'
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
    const { me, loader } = this.props;
    const fullName = `${me.get('first_name')} ${me.get('last_name')}`;
    return (
      <SW.Wrapper>
        {this.renderProfileImage()}
        <SW.NameField onClick={this.handleOpenProfileUpdate}>
          {fullName}
        </SW.NameField>
        <SW.OptionsButton
          icon="ThreeDots"
          onClick={this.handleThreeDots}
          status={loader.get('ThreeDots')}
        />
      </SW.Wrapper>
    );
  }
}
