import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { map } from 'react-immutable-proptypes';
import { bindAll, setupDelegate, setupCachedCallback } from 'swipes-core-js/classes/utils';
import ReactTextarea from 'react-textarea-autosize';
import HOCHeaderTitle from 'components/header-title/HOCHeaderTitle';
import SWView from 'SWView';
import Icon from 'Icon';
import Button from 'Button';

import './styles/profile.scss';

class Profile extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      editing: false,
      bioCounter: 300,
    };

    setupDelegate(this);
    this.onChangeCached = setupCachedCallback(this.onChange, this);
    this.onEditCached = setupCachedCallback(this.enableEditMode, this);
    this.onBlurCached = setupCachedCallback(this.callDelegate.bind(null, 'onBlur'));
    this.handleEditState = this.handleEditState.bind(this);
    this.onImageChange = this.callDelegate.bind(null, 'onImageChange');


    bindAll(this, ['enableEditMode', 'onUploadClick']);
  }
  onChange(key, e) {
    if (key === 'bio') {
      this.setState({ bioCounter: 300 - e.target.value.length });
    }
    this.callDelegate('onChange', key, e.target.value);
  }
  onUploadClick() {
    this.refs.imageUpload.click();
  }
  enableEditMode(refKey) {
    const { editing } = this.state;

    if (!editing) {
      this.setState({ editing: true }, () => {
        if (this.refs[refKey]) {
          this.refs[refKey].focus();
        }
      });
    }
  }
  handleEditState() {
    const { editing } = this.state;

    this.setState({ editing: !editing });
  }
  renderLoaderForKey(key) {
    const { getLoading } = this.props;

    if (getLoading(key).loading) {
      return (
        <svg className="spinner" viewBox="0 0 50 50">
          <circle className="spinner__path" cx="25" cy="25" r="20" fill="none" />
        </svg>
      );
    } else if (getLoading(key).errorLabel) {
      return (
        <div className="profile__error-icon" data-error={getLoading(key).errorLabel}>
          <Icon icon="Close" className="profile__svg" />
        </div>
      );
    } else if (getLoading(key).successLabel) {
      return (
        <div className="profile__success-icon">
          <Icon icon="ActivityCheckmark" className="profile__svg" />
        </div>
      );
    }

    return undefined;
  }
  renderHeader() {
    const { editing } = this.state;

    return (
      <HOCHeaderTitle title="Profile">
        <Button text={editing ? 'Done' : 'Edit'} onClick={this.handleEditState} />
      </HOCHeaderTitle>
    );
  }
  renderProfileImage() {
    const { me, getLoading } = this.props;
    const isLoading = getLoading('uploadImage').loading;
    const initials = msgGen.users.getInitials(me);
    const profilePic = msgGen.users.getPhoto(me);

    return (
      <div className="profile-header__profile-image">

        { profilePic ? (
          <img src={profilePic} role="presentation" />
        ) : (
          <div className="profile-header__initials">{initials}</div>
        )}

        <div className="profile-header__upload-overlay" onClick={this.onUploadClick}>
          <Icon icon="Plus" className="profile-header__svg" />
        </div>
        <input
          onChange={this.onImageChange}
          type="file"
          accept="image/x-png,image/jpeg"
          className="profile-header__file-input"
          ref="imageUpload"
        />
        <div className={`profile-header__loading ${isLoading ? 'profile-header__loading--show' : ''}`}>
          <svg className="spinner" viewBox="0 0 50 50">
            <circle className="spinner__path" cx="25" cy="25" r="20" fill="none" />
          </svg>
        </div>
      </div>
    );
  }
  renderProfileHeader() {
    const { firstName, lastName } = this.props;
    const { editing } = this.state;
    let disabled = true;

    if (editing) {
      disabled = false;
    }


    return (
      <div className="profile-header">
        {this.renderProfileImage()}
        <div className="profile-header__form">
          <div className="profile-header__row" onClick={this.onEditCached('firstNameInput')}>
            <input
              ref="firstNameInput"
              type="text"
              value={firstName}
              onChange={this.onChangeCached('firstName')}
              className="profile-header__input"
              placeholder="First name"
              onBlur={this.onBlurCached('firstName')}
              disabled={disabled}
            />
            <div className="profile-header__loader">
              {this.renderLoaderForKey('firstName')}
            </div>
          </div>
          <div className="profile-header__row" onClick={this.onEditCached('lastNameInput')}>
            <input
              ref="lastNameInput"
              type="text"
              value={lastName}
              onChange={this.onChangeCached('lastName')}
              onBlur={this.onBlurCached('lastName')}
              className="profile-header__input"
              placeholder="Last name"
              disabled={disabled}
            />
            <div className="profile-header__loader">
              {this.renderLoaderForKey('lastName')}
            </div>
          </div>
        </div>
      </div>
    );
  }
  renderForm() {
    const { role, bio, email, me } = this.props;
    const { bioCounter, editing } = this.state;
    let counterClass = 'profile-form__counter';
    let disabled = true;

    if (editing) {
      disabled = false;
    }

    if (bioCounter < 0) {
      counterClass += ' profile-form__counter--limit';
    }

    return (
      <div className="profile-form">
        <div className="profile-form__row" onClick={this.onEditCached('roleInput')}>
          <div className="profile-form__title">ROLE</div>
          <input
            ref="roleInput"
            type="text"
            value={role}
            onChange={this.onChangeCached('role')}
            onBlur={this.onBlurCached('role')}
            className="profile-form__input"
            placeholder={`What is your role at ${msgGen.users.getOrganizationName(me)}?`}
            disabled={disabled}
          />
          <div className="profile-form__loader">
            {this.renderLoaderForKey('role')}
          </div>
        </div>
        <div className="profile-form__row" onClick={this.onEditCached('bioInput')}>
          <div className="profile-form__title">BIO</div>
          <ReactTextarea
            ref="bioInput"
            minRows={1}
            maxRows={6}
            value={bio}
            onChange={this.onChangeCached('bio')}
            onBlur={this.onBlurCached('bio')}
            className="profile-form__textarea"
            placeholder="Share with the team a bit about yourself - What are you working on? What do you love doing?"
            disabled={disabled}
          />
          <div className="profile-form__loader">
            {this.renderLoaderForKey('bio')}
          </div>
          <div className={counterClass}>{bioCounter}</div>
        </div>
        <div className="profile-form__row">
          <div className="profile-form__title">EMAIL</div>
          <input
            type="email"
            value={email}
            onChange={this.onChangeCached('email')}
            onBlur={this.onBlurCached('email')}
            className="profile-form__input"
            placeholder="stefan@swipesapp.com"
            disabled
          />
        </div>
      </div>
    );
  }
  render() {
    const { editing } = this.state;
    let className = 'profile';

    if (editing) {
      className += ' profile--editing';
    }

    return (
      <SWView header={this.renderHeader()}>
        <div className={className}>
          <div className="profile__wrapper">
            {this.renderProfileHeader()}
            {this.renderForm()}
          </div>
        </div>
      </SWView>
    );
  }
}

export default Profile;

const { object, string, func } = PropTypes;

Profile.propTypes = {
  firstName: string,
  lastName: string,
  role: string,
  bio: string,
  email: string,
  delegate: object,
  me: map,
  getLoading: func,
};
