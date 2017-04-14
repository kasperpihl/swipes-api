import React, { PureComponent } from 'react';
import { setupCachedCallback, setupDelegate } from 'swipes-core-js/classes/utils';
import Button from 'Button';
// import { map, list } from 'react-immutable-proptypes';

class SignupPage extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
    setupDelegate(this);
    this.onClick = this.callDelegate.bind(null, 'onClick');
    this.onChangeCached = setupCachedCallback(this.callDelegate.bind(null, 'onChange'));
  }
  componentDidMount() {
  }
  renderPeople() {
    const { users } = this.props;

    console.log('users', users);
    return (
      <div className="assignees">
        <div className="assignee">
          <img src="https://s3.amazonaws.com/uifaces/faces/twitter/jsa/128.jpg" alt="" />
        </div>
        <div className="assignee">
          <img src="https://s3.amazonaws.com/uifaces/faces/twitter/jsa/128.jpg" alt="" />
        </div>
        <div className="assignee">
          <img src="https://s3.amazonaws.com/uifaces/faces/twitter/jsa/128.jpg" alt="" />
        </div>
      </div>
    );
  }
  renderInputField(key, type, placeholder) {
    const value = this.props.formData.get(key) || '';

    return (
      <div className="floating-input">
        <input
          type={type}
          value={value}
          id={key}
          onChange={this.onChangeCached(key)}
          className="floating-input__input"
        />
        <label htmlFor={key}>{placeholder}</label>
      </div>
    );
  }
  render() {
    return (
      <div className="singup-wrapper">
        <div className="title-container">
          {this.renderPeople()}
          <h1 className="title">Join the Telenor team</h1>
        </div>
        <h3 className="subtitle">Your team is waiting for you. Sign up to join them</h3>

        <div className="form">
          {this.renderInputField('email', 'email', 'name@example.com')}
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
