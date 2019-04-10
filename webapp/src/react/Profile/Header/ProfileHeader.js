import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import withLoader from 'src/react/_hocs/withLoader';
import * as mainActions from 'src/redux/main/mainActions';
import FormModal from 'src/react/_components/FormModal/FormModal';
import UserImage from 'src/react/_components/UserImage/UserImage';
import SW from './ProfileHeader.swiss';
import ListMenu from 'src/react/_components/ListMenu/ListMenu';
import request from 'core/utils/request';
import Loader from 'src/react/_components/loaders/Loader';

import withNav from 'src/react/_hocs/Nav/withNav';
import Spacing from '_shared/Spacing/Spacing';

@withNav
@withLoader
@connect(
  state => ({
    state,
    me: state.me
  }),
  {
    contextMenu: mainActions.contextMenu
  }
)
export default class ProfileHeader extends PureComponent {
  logout() {
    const { nav, loader } = this.props;
    nav.openModal(FormModal, {
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
      request('me.uploadPhoto', { photo: file }, { formData: true }).then(
        res => {
          loader.clear('uploadImage');
          if (res.ok) {
            window.analytics.sendEvent('Profile photo updated');
            console.log(res);
          } else {
            console.log(res);
          }
        }
      );
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
    const { nav, me } = this.props;

    nav.openModal(FormModal, {
      title: 'Update Profile',
      inputs: [
        {
          type: 'text',
          label: 'First name',
          autoFocus: true,
          initialValue: me.get('first_name'),
          nameChange: true
        },
        {
          type: 'text',
          label: 'Last name',
          initialValue: me.get('last_name'),
          nameChange: true
        }
      ],
      onConfirm: this.callbackProfileUpdate,
      confirmLabel: 'Update'
    });
  };

  handleUpload = () => {
    this.imageUpload.click();
  };

  renderProfileImage = () => {
    const { loader } = this.props;
    if (loader.check('uploadImage')) {
      return (
        <SW.ProfileImage>
          <Loader mini size={24} />
        </SW.ProfileImage>
      );
    }
    return (
      <SW.ProfileImage>
        <UserImage userId="me" />
        <SW.HeaderFileInput
          className="fileInput"
          onChange={this.handleImageChange}
          type="file"
          accept="image/x-png,image/jpeg,image/png"
          innerRef={c => (this.imageUpload = c)}
        />
        <SW.ButtonWrapper onClick={this.handleUpload}>
          <SW.OverlaySVG icon="Plus" />
        </SW.ButtonWrapper>
      </SW.ProfileImage>
    );
  };
  render() {
    const { me, loader } = this.props;
    const fullName = `${me.get('first_name')} ${me.get('last_name')}`;

    return (
      <SW.Wrapper>
        {this.renderProfileImage()}
        <SW.UserInfo>
          <SW.NameField onClick={this.handleOpenProfileUpdate}>
            {fullName}
          </SW.NameField>
          <Spacing height={2} />
          <SW.Subtitle>{`Member of ${2} teams`}</SW.Subtitle>
        </SW.UserInfo>
        <SW.OptionsButton
          icon="ThreeDots"
          onClick={this.handleThreeDots}
          status={loader.get('ThreeDots')}
        />
      </SW.Wrapper>
    );
  }
}
