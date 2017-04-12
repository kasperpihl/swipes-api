import React, { PureComponent, PropTypes } from 'react';
import { map } from 'react-immutable-proptypes';
import { setupDelegate, setupCachedCallback } from 'swipes-core-js/classes/utils';
import ReactTextarea from 'react-textarea-autosize';
import SWView from 'SWView';
import Icon from 'Icon';

import './styles/Profile.scss';

class Profile extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      editing: false,
      bioCounter: 300,
    };

    this.callDelegate = setupDelegate(props.delegate);
    this.onChangeCached = setupCachedCallback(this.onChange, this);
    this.handleEditState = this.handleEditState.bind(this);
  }
  onChange(key, e) {
    if (key === 'bio') {
      this.setState({ bioCounter: 300 - e.target.value.length });
    }
    this.callDelegate('onChange', key, e.target.value);
  }
  handleEditState() {
    const { editing } = this.state;

    this.setState({ editing: !editing });
  }
  renderProfileImage() {
    const { me } = this.props;
    const { editing } = this.state;

    if (!editing) {
      if (me.get('profile_pic')) {
        return (
          <div className="profile-header__profile-image">
            <img src={me.get('profile_pic')} role="presentation" />
          </div>
        );
      } else {
        const initials = msgGen.users.getInitals(me);

        return <div className="profile-header__initials">{initials}</div>;
      }
    }

    if (me.get('profile_pic')) {
      return (
        <div className="profile-header__profile-image">
          <img src={me.get('profile_pic')} role="presentation" />
          <div className="profile-header__upload-overlay">
            <Icon icon="Plus" className="profile-header__svg" />
          </div>
        </div>
      );
    }

    return (
      <div className="profile-header__profile-image">
        <Icon icon="plus" className="profile-header__svg" />
      </div>
    );
  }
  renderHeader() {
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
          <input
            type="text"
            value={firstName}
            onChange={this.onChangeCached('firstName')}
            className="profile-header__input"
            placeholder="First name"

            disabled={disabled}
          />
          <input
            type="text"
            value={lastName}
            onChange={this.onChangeCached('lastName')}
            className="profile-header__input"
            placeholder="Last name"
            disabled={disabled}
          />
        </div>
      </div>
    );
  }
  renderForm() {
    const { role, bio, email, getLoading } = this.props;
    const { bioCounter, editing } = this.state;
    let counterClass = 'profile-form__counter';
    let disabled = true;

    if (editing) {
      disabled = false;
    }

    if (bioCounter < 0) {
      counterClass += ' profile-form__counter--limit';
    }
    const roleLoader = getLoading('role').loading;
    console.log('roleLoader', roleLoader);
    const roleErrorLabel = getLoading('role').errorLabel;
    console.log('roleErrorLabel', roleErrorLabel);
    console.log('firstNameError', getLoading('firstName').errorLabel);
    return (
      <div className="profile-form">
        <div className="profile-form__row">
          <div className="profile-form__title">ROLE</div>
          <input
            type="text"
            value={role}
            onChange={this.onChangeCached('role')}
            className="profile-form__input"
            placeholder="Write your role"
            disabled={disabled}
          />
        </div>
        <div className="profile-form__row">
          <div className="profile-form__title">BIO</div>
          <ReactTextarea
            rows={6}
            value={bio}
            onChange={this.onChangeCached('bio')}
            className="profile-form__textarea"
            placeholder="What are you doing at Swipes?"
            disabled={disabled}
          />
          <div className={counterClass}>{bioCounter}</div>
        </div>
        <div className="profile-form__row">
          <div className="profile-form__title">EMAIL</div>
          <input
            type="email"
            value={email}
            onChange={this.onChangeCached('email')}
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
      <SWView>
        <div className={className}>
          <div className="profile__wrapper">
            {this.renderHeader()}
            {this.renderForm()}
          </div>
          <div
            className="profile__edit-button"
            onClick={this.handleEditState}
          >
            {editing ? 'Done' : 'Edit'}
          </div>
        </div>
      </SWView>
    );
  }
}

export default Profile;

const { object, string } = PropTypes;

Profile.propTypes = {
  firstName: string,
  lastName: string,
  role: string,
  bio: string,
  email: string,
  delegate: object,
  me: map,
};
