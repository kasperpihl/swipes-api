import React, { PureComponent } from 'react';
import SignupInput from './SignupInput';
import { setupDelegate } from 'swipes-core-js/classes/utils';
// import { map, list } from 'react-immutable-proptypes';

import './styles/signup.scss';

class SignupPage extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
    setupDelegate(this);
    this.onClick = this.callDelegate.bind(null, 'onClick');
  }
  componentDidMount() {
  }
  generateTitle() {
    const { organization, inviter } = this.props;
    if (!inviter) {
      return undefined;
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
  renderInputField(key, type, placeholder) {
    const { delegate } = this.props;
    const value = this.props.formData.get(key) || '';

    return <SignupInput key={key} inputKey={key} type={type} placeholder={placeholder} delegate={delegate} value={value} />;
  }
  render() {
    return (
      <div className="singup-wrapper">
        <div className="title-container">
          {this.renderPeople()}
          <h1 className="title">{this.generateTitle()}</h1>
        </div>
        <h3 className="subtitle">Your team is waiting for you. Sign up to join them</h3>

        <div className="form">
          {this.renderInputField('email', 'email', 'Email')}
          {this.renderInputField('firstName', 'text', 'First name')}
          {this.renderInputField('lastName', 'text', 'Last name')}
          {this.renderInputField('password', 'password', 'Password')}
        </div>

        <div className="footer">
          <div className="button" onClick={this.onClick}>Sign up</div>
          <div className="footer-sentence">
            By signing up you, agree to the <a href="#">Terms & Conditions</a>
          </div>
        </div>
      </div>
    );
  }
}

export default SignupPage;

// const { string } = PropTypes;

SignupPage.propTypes = {};
