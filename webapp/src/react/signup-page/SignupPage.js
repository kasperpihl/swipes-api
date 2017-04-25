import React, { PureComponent } from 'react';
import SignupInput from './SignupInput';
import { setupDelegate } from 'swipes-core-js/classes/utils';
// import { map, list } from 'react-immutable-proptypes';
import Icon from 'Icon';
import './styles/signup.scss';

class SignupPage extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
    setupDelegate(this);
    this.onClick = this.callDelegate.bind(null, 'onClick');
    this.handleKeyDown = this.handleKeyDown.bind(this);
  }
  componentDidMount() {
  }
  handleKeyDown(e) {
    if (e.keyCode === 13) {
      this.onClick();
    }
  }
  getSubtitle() {
    const { organization, inviter, createOrganization } = this.props;
    if (createOrganization) {
      return 'You are invited to try the Swipes Workspace for a 14-day free trial. Start your trial by signing up. No credit card required. After the trial, continue using the Workspace for $15 per user / month.';
    }
    if (!inviter) {
      return 'Hint: Swipes Personal users are getting invites.';
    }
    return 'Your team is waiting for you. Sign up to join them';
  }
  generateTitle() {
    const { organization, inviter, createOrganization } = this.props;
    if (createOrganization) {
      return 'Sign up organization';
    }
    if (!inviter) {
      return 'Swipes Workspace is invite only';
    }
    return `Join ${msgGen.users.getFirstName(inviter)} and the ${organization.get('name')} team`;
  }
  renderPeople() {
    const { inviter } = this.props;
    if (!inviter) {
      return undefined;
    }
    const photoSrc = msgGen.users.getPhoto(inviter);
    if (!photoSrc) {
      return undefined;
    }
    return (
      <div className="assignees">
        <div className="assignee">
          <img src={photoSrc} alt="" />
        </div>
      </div>
    );
  }
  renderHeader() {
    return [
      <div key="1" className="title-container">
        {this.renderPeople()}
        <h1 className="title">{this.generateTitle()}</h1>
      </div>,
      <h3 key="2" className="subtitle">{this.getSubtitle()}</h3>,
    ];
  }
  renderForm() {
    const { createOrganization: cO, inviter } = this.props;
    if (!cO && !inviter) {
      return undefined;
    }
    return (
      <div className="form">
        {cO ? this.renderInputField('organizationName', 'text', 'Organization name') : undefined}
        {this.renderInputField('email', 'email', 'Email')}
        {this.renderInputField('firstName', 'text', 'First name')}
        {this.renderInputField('lastName', 'text', 'Last name')}
        {this.renderInputField('password', 'password', 'Password', { onKeyDown: this.handleKeyDown })}
      </div>
    );
  }
  renderInputField(key, type, placeholder, props) {
    const { delegate } = this.props;
    const value = this.props.formData.get(key) || '';

    return (
      <SignupInput
        key={key}
        inputKey={key}
        type={type}
        placeholder={placeholder}
        delegate={delegate}
        value={value}
        props={props}
      />
    );
  }
  renderFooter() {
    const { createOrganization: cO, inviter } = this.props;
    if (!cO && !inviter) {
      return undefined;
    }
    const isLoading = this.props.getLoading('signupButton').loading;

    return (
      <div className="footer">
        <div className="button" ref="button" onClick={this.onClick}>
          {
            isLoading ? (
              <Icon icon="loader" width="12" height="12" />
            ) : (
              'Sign up'
            )
          }
        </div>
        <div className="footer-sentence">
          By signing up you agree to the <a target="_blank" href="http://swipesapp.com/workspacepolicies.pdf">Terms of service</a>
        </div>
      </div>
    );
  }
  render() {
    return (
      <div className="singup-wrapper">
        {this.renderHeader()}

        {this.renderForm()}

        {this.renderFooter()}
      </div>
    );
  }
}

export default SignupPage;

// const { string } = PropTypes;

SignupPage.propTypes = {};
