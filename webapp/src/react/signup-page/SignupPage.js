import React, { PureComponent } from 'react'
import { setupCachedCallback, setupDelegate } from 'swipes-core-js/classes/utils';
import Button from 'Button';
// import { map, list } from 'react-immutable-proptypes';

class SignupPage extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {}
    setupDelegate(this);
    this.onClick = this.callDelegate.bind(null, 'onClick');
    this.onChangeCached = setupCachedCallback(this.callDelegate.bind(null, 'onChange'));
  }
  componentDidMount() {
  }
  renderInputField(key, props) {
    const value = this.props.formData.get(key) || '';
    return (
      <input
        type="text"
        value={value}
        onChange={this.onChangeCached(key)}
        {...props}
      />
    )
  }
  render() {
    return (
      <div className="signup-page">
        {this.renderInputField('email', { placeholder: 'name@example.com' })}
        {this.renderInputField('firstName', { placeholder: 'First name' })}
        {this.renderInputField('lastName', { placeholder: 'Last name' })}
        {this.renderInputField('password', { placeholder: 'Password', type: 'password' })}
        <Button
          text="Sign up"
          primary
          onClick={this.onClick}
        />
      </div>
    )
  }
}

export default SignupPage

// const { string } = PropTypes;

SignupPage.propTypes = {};
