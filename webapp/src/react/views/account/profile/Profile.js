import React, { PureComponent } from 'react';
import { setupDelegate } from 'react-delegate';
import { bindAll } from 'swipes-core-js/classes/utils';
import { setupCachedCallback } from 'react-delegate';
import HOCHeaderTitle from 'components/header-title/HOCHeaderTitle';
import SWView from 'SWView';
import Button from 'src/react/components/button/Button';
import SW from './Profile.swiss';

class Profile extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      editing: false,
      bioCounter: 300,
    };

    setupDelegate(this, 'onBlur', 'onImageChange');
    this.onChangeCached = setupCachedCallback(this.onChange, this);
    this.onEditCached = setupCachedCallback(this.enableEditMode, this);
    this.handleEditState = this.handleEditState.bind(this);


    bindAll(this, ['enableEditMode', 'onUploadClick']);
  }
  onChange(key, e) {
    if (key === 'bio') {
      this.setState({ bioCounter: 300 - e.target.value.length });
    }
    this.callDelegate('onChange', key, e.target.value);
  }
  onUploadClick() {
    this.imageUpload.click();
  }
  enableEditMode(refKey) {
    const { editing } = this.state;

    if (!editing) {
      this.setState({ editing: true }, () => {
        if (this[refKey]) {
          this[refKey].focus();
        }
      });
    }
  }

  handleEditState() {
    const { editing } = this.state;

    this.setState({ editing: !editing });
  }
  renderLoaderForKey(key) {
    const { getLoading, isLoading } = this.props;

    if (isLoading(key)) {
      return (
        <SW.Spinner viewBox="0 0 50 50">
          <SW.SpinnerPath cx="25" cy="25" r="20" fill="none" />
        </SW.Spinner>
      );
    } else if (getLoading(key).error) {
      return (
        <SW.ErrorIcon data-error={getLoading(key).error}>
          <SW.ErrorSVG icon="Close" />
        </SW.ErrorIcon>
      );
    } else if (getLoading(key).success) {
      return (
        <SW.SuccessIcon>
          <SW.SuccessSVG icon="ChecklistCheckmark"/>
        </SW.SuccessIcon>
      );
    }

    return undefined;
  }
  renderHeader() {
    const { editing } = this.state;

    return (
      <HOCHeaderTitle title="Profile">
        <Button title={editing ? 'Done' : 'Edit'} onClick={this.handleEditState} />
      </HOCHeaderTitle>
    );
  }
  renderProfileImage() {
    const { me, isLoading } = this.props;
    const initials = msgGen.users.getInitials(me);
    const profilePic = msgGen.users.getPhoto(me);

    return (
      <SW.ProfileImage>

        { profilePic ? (
          <SW.Picture src={profilePic} role="presentation" className='initials'/>
        ) : (
          <SW.HeaderInitials className='initials'>{initials}</SW.HeaderInitials>
        )}

        <SW.HeaderFileInput
            className='fileInput'
            onChange={this.onImageChange}
            type="file"
            accept="image/x-png,image/jpeg"
            innerRef={(c) => this.imageUpload = c}
        />
        <SW.OverlaySVG icon="Plus" />
        <SW.HeaderLoading isLoading={isLoading('uploadImage') ? true : ''}>
          <SW.LoadingIcon viewBox="0 0 50 50">
            <SW.SpinnerPath cx="25" cy="25" r="20" fill="none" />
          </SW.LoadingIcon>
        </SW.HeaderLoading>
      </SW.ProfileImage>
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
      <SW.Header>
        {this.renderProfileImage()}
        <SW.HeaderForm>
          <SW.HeaderRow onClick={this.onEditCached('firstNameInput')}>
            <SW.HeaderInput
              innerRef={(c) => this.firstNameInput = c}
              type="text"
              value={firstName}
              onChange={this.onChangeCached('firstName')}
              placeholder="First name"
              onBlur={this.onBlurCached('firstName')}
              disabled={disabled}
            />
            <SW.HeaderLoader>
              {this.renderLoaderForKey('firstName')}
            </SW.HeaderLoader>
          </SW.HeaderRow>
          <SW.HeaderRow onClick={this.onEditCached('lastNameInput')}>
            <SW.HeaderInput
              innerRef={(c) => this.lastNameInput = c}
              type="text"
              value={lastName}
              onChange={this.onChangeCached('lastName')}
              onBlur={this.onBlurCached('lastName')}
              placeholder="Last name"
              disabled={disabled}
            />
            <SW.HeaderLoader>
              {this.renderLoaderForKey('lastName')}
            </SW.HeaderLoader>
          </SW.HeaderRow>
        </SW.HeaderForm>
      </SW.Header>
    );
  }
  renderForm() {
    const { role, bio, email, me } = this.props;
    const { bioCounter, editing } = this.state;
    let disabled = true;

    if (editing) {
      disabled = false;
    }

    return (
      <SW.Form>
        <SW.FormRow onClick={this.onEditCached('roleInput')}>
          <SW.FormTitle>ROLE</SW.FormTitle>
          <SW.FormInput
            innerRef={(c) => this.roleInput = c}
            type="text"
            value={role}
            onChange={this.onChangeCached('role')}
            onBlur={this.onBlurCached('role')}
            placeholder={`What is your role at ${msgGen.users.getOrganizationName(me)}?`}
            disabled={disabled}
          />
          <SW.FormLoader>
            {this.renderLoaderForKey('role')}
          </SW.FormLoader>
        </SW.FormRow>
        <SW.FormRow onClick={this.onEditCached('bioInput')}>
          <SW.FormTitle>BIO</SW.FormTitle>
          <SW.FormTextArea
            minRows={1}
            maxRows={6}
            value={bio}
            onChange={this.onChangeCached('bio')}
            onBlur={this.onBlurCached('bio')}
            placeholder="Share with the team a bit about yourself - What are you working on? What do you love doing?"
            disabled={disabled}
          />
          <SW.FormLoader>
            {this.renderLoaderForKey('bio')}
          </SW.FormLoader>
          <SW.FormCounter disabled={disabled}>{bioCounter}</SW.FormCounter>
        </SW.FormRow>
        <SW.FormRow>
          <SW.FormTitle>EMAIL</SW.FormTitle>
          <SW.EmailField>{email}</SW.EmailField>
        </SW.FormRow>
      </SW.Form>
    );
  }
  render() {
    const { editing } = this.state;

    return (
      <SWView header={this.renderHeader()}>
        <SW.MainWrapper>
          <SW.ProfileWrapper>
            {this.renderProfileHeader()}
            {this.renderForm()}
          </SW.ProfileWrapper>
        </SW.MainWrapper>
      </SWView>
    );
  }
}

export default Profile;
