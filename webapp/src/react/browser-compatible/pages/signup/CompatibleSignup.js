import React, { PureComponent } from 'react';
import { setupDelegate } from 'react-delegate';
// import { map, list } from 'react-immutable-proptypes';
import Icon from 'Icon';
import FloatingInput from 'compatible/components/input/FloatingInput';
import CompatibleHeader from 'compatible/components/header/CompatibleHeader'
import './styles/signup.scss';

class CompatibleSignup extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
    setupDelegate(this, 'onSignup');
    this.handleKeyDown = this.handleKeyDown.bind(this);
  }
  componentDidMount() {
  }
  handleKeyDown(e) {
    if (e.keyCode === 13) {
      this.onSignup();
    }
  }
  getSubtitle() {
    const { organization } = this.props;
    if (!organization) {
      return 'Sign up to try the Swipes Workspace for a 14-day free trial. No credit card required. After the trial, continue using the Workspace for $9 per user / month.';
    }
    return 'Your team is waiting for you. Sign up to join them.';
  }
  generateTitle() {
    const { organization, inviter } = this.props;
    if (!organization) {
      return 'New account to Swipes Workspace.';
    }

    return `Join ${msgGen.users.getFirstName(inviter)} and the ${organization.get('name')} team`;
  }
  renderHeader() {
    const { inviter } = this.props;
    
    return (
      <CompatibleHeader title={this.generateTitle()} subtitle={this.getSubtitle()} assignee={inviter} />
    )
  }
  renderInputField(key, type, placeholder, props) {
    const { delegate } = this.props;
    const value = this.props.formData.get(key) || '';

    return (
      <FloatingInput
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
  renderForm() {
    return (
      <div className="form">
        {this.renderInputField('email', 'email', 'Email')}
        {this.renderInputField('firstName', 'text', 'First name')}
        {this.renderInputField('lastName', 'text', 'Last name')}
        {this.renderInputField('password', 'password', 'Password', { onKeyDown: this.handleKeyDown })}
      </div>
    );
  }
  renderFooter() {
    const { inviter } = this.props;
    const isLoading = this.props.getLoading('signupButton').loading;

    return (
      <div className="footer">
        <a className="footer__button" ref="button" onClick={this.onSignup}>
          {
            isLoading ? (
              <Icon icon="loader" width="12" height="12" />
            ) : (
              'Sign up'
            )
          }
        </a>
        <div className="footer__sentence">
          By signing up you agree to the <a target="_blank" href="http://swipesapp.com/workspacepolicies.pdf">Terms of service</a>
        </div>
      </div>
    );
  }
  render() {
    return (
      <div className="compatible-signup">
        {this.renderHeader()}
        {this.renderForm()}
        {this.renderFooter()}
      </div>
    );
  }
}

export default CompatibleSignup;

// const { string } = PropTypes;

CompatibleSignup.propTypes = {};
