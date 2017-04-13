import React, { PureComponent } from 'react'
import { setupCachedCallback, setupDelegate } from 'swipes-core-js/classes/utils';
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
  renderInputField(key, placeholder) {
    const value = this.props.formData.get(key) || '';
    return (
      <input
        type="text"
        value={value}
        onChange={this.onChangeCached(key)}
        placeholder={placeholder}
      />
    )
  }
  render() {
    return (
      <div className="signup-page">
        {this.renderInputField('email', 'name@example.com')}
        {this.renderInputField('firstName', 'First name')}
        {this.renderInputField('lastName', 'Last name')}
        {this.renderInputField('password', 'Password')}
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
