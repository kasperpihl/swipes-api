import React, { PureComponent } from 'react';
import { setupDelegate } from 'react-delegate';
import { bindAll } from 'swipes-core-js/classes/utils';
import { setupCachedCallback } from 'react-delegate';
import { styleElement } from 'swiss-react';
import ReactTextarea from 'react-textarea-autosize';
import HOCHeaderTitle from 'components/header-title/HOCHeaderTitle';
import SWView from 'SWView';
import Icon from 'Icon';
import Button from 'src/react/components/button/Button';
import styles from './styles/Profile.swiss';

const MainWrapper = styleElement('div', styles.MainWrapper);
const ProfileWrapper = styleElement('div', styles.ProfileWrapper);
const Header = styleElement('div', styles.Header);
const ProfileImage = styleElement('div', styles.ProfileImage);
const Picture = styleElement('img', styles.Picture);
const UploadOverlay = styleElement('div', styles.UploadOverlay);
const OverlaySVG = styleElement(Icon, styles.OverlaySVG);
const HeaderInitials = styleElement('div', styles.HeaderInitials);
const HeaderFileInput = styleElement('input', styles.HeaderFileInput);
const HeaderLoading = styleElement('div', styles.HeaderLoading);
const HeaderForm = styleElement('div', styles.HeaderForm);
const HeaderInput = styleElement('input', styles.HeaderInput);
const HeaderRow = styleElement('div', styles.HeaderRow);
const HeaderLoader = styleElement('div', styles.HeaderLoader);
const Form = styleElement('div', styles.Form);
const FormRow = styleElement('div', styles.FormRow);
const FormLoader = styleElement('div', styles.FormLoader);
const FormTitle = styleElement('div', styles.FormTitle);
const FormInput = styleElement('input', styles.FormInput);
const EmailField = styleElement('div', styles.EmailField);
const FormTextArea = styleElement(ReactTextarea, styles.FormTextArea);
const FormCounter = styleElement('div', styles.FormCounter);
const Spinner = styleElement('svg', styles.Spinner);
const ErrorIcon = styleElement('div', styles.ErrorIcon);
const ErrorSVG = styleElement(Icon, styles.ErrorSVG);
const SpinnerPath = styleElement('circle', styles.SpinnerPath);
const SuccessIcon = styleElement('div', styles.SuccessIcon);
const SuccessSVG = styleElement(Icon, styles.SuccessSVG);
const LoadingIcon = styleElement('svg', styles.LoadingIcon);

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
        <Spinner viewBox="0 0 50 50">
          <SpinnerPath cx="25" cy="25" r="20" fill="none" />
        </Spinner>
      );
    } else if (getLoading(key).error) {
      return (
        <ErrorIcon data-error={getLoading(key).error}>
          <ErrorSVG icon="Close" />
        </ErrorIcon>
      );
    } else if (getLoading(key).success) {
      return (
        <SuccessIcon>
          <SuccessSVG icon="ChecklistCheckmark"/>
        </SuccessIcon>
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
      <ProfileImage>

        { profilePic ? (
          <Picture src={profilePic} role="presentation" className='initials'/>
        ) : (
          <HeaderInitials className='initials'>{initials}</HeaderInitials>
        )}

        <HeaderFileInput
            className='fileInput'
            onChange={this.onImageChange}
            type="file"
            accept="image/x-png,image/jpeg"
            innerRef={(c) => this.imageUpload = c}
        />
        <OverlaySVG icon="Plus" />
        <HeaderLoading isLoading={isLoading('uploadImage') ? true : ''}>
          <LoadingIcon viewBox="0 0 50 50">
            <SpinnerPath cx="25" cy="25" r="20" fill="none" />
          </LoadingIcon>
        </HeaderLoading>
      </ProfileImage>
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
      <Header>
        {this.renderProfileImage()}
        <HeaderForm>
          <HeaderRow onClick={this.onEditCached('firstNameInput')}>
            <HeaderInput
              innerRef={(c) => this.firstNameInput = c}
              type="text"
              value={firstName}
              onChange={this.onChangeCached('firstName')}
              placeholder="First name"
              onBlur={this.onBlurCached('firstName')}
              disabled={disabled}
            />
            <HeaderLoader>
              {this.renderLoaderForKey('firstName')}
            </HeaderLoader>
          </HeaderRow>
          <HeaderRow onClick={this.onEditCached('lastNameInput')}>
            <HeaderInput
              innerRef={(c) => this.lastNameInput = c}
              type="text"
              value={lastName}
              onChange={this.onChangeCached('lastName')}
              onBlur={this.onBlurCached('lastName')}
              placeholder="Last name"
              disabled={disabled}
            />
            <HeaderLoader>
              {this.renderLoaderForKey('lastName')}
            </HeaderLoader>
          </HeaderRow>
        </HeaderForm>
      </Header>
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
      <Form>
        <FormRow onClick={this.onEditCached('roleInput')}>
          <FormTitle>ROLE</FormTitle>
          <FormInput
            innerRef={(c) => this.roleInput = c}
            type="text"
            value={role}
            onChange={this.onChangeCached('role')}
            onBlur={this.onBlurCached('role')}
            placeholder={`What is your role at ${msgGen.users.getOrganizationName(me)}?`}
            disabled={disabled}
          />
          <FormLoader>
            {this.renderLoaderForKey('role')}
          </FormLoader>
        </FormRow>
        <FormRow onClick={this.onEditCached('bioInput')}>
          <FormTitle>BIO</FormTitle>
          <FormTextArea
            minRows={1}
            maxRows={6}
            value={bio}
            onChange={this.onChangeCached('bio')}
            onBlur={this.onBlurCached('bio')}
            placeholder="Share with the team a bit about yourself - What are you working on? What do you love doing?"
            disabled={disabled}
          />
          <FormLoader>
            {this.renderLoaderForKey('bio')}
          </FormLoader>
          <FormCounter disabled={disabled}>{bioCounter}</FormCounter>
        </FormRow>
        <FormRow>
          <FormTitle>EMAIL</FormTitle>
          <EmailField>{email}</EmailField>
        </FormRow>
      </Form>
    );
  }
  render() {
    const { editing } = this.state;

    return (
      <SWView header={this.renderHeader()}>
        <MainWrapper>
          <ProfileWrapper>
            {this.renderProfileHeader()}
            {this.renderForm()}
          </ProfileWrapper>
        </MainWrapper>
      </SWView>
    );
  }
}

export default Profile;
