import React, { PureComponent } from 'react';
import Button from 'src/react/components/Button/Button';
import SW from './UserOptionsModal.swiss';

export default class UserOptionsModal extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      passwordInput: ''
    };
  }

  handleInputChange = e => {
    this.setState({ passwordInput: e.target.value });
  };
  render() {
    const { userAction, title } = this.props;

    return (
      <SW.Wrapper>
        <SW.Title>{title}</SW.Title>
        <SW.PasswordInput
          type="password"
          placeholder="Enter your password"
          value={this.state.passwordInput}
          onChange={this.handleInputChange}
        />
        <Button.Rounded title="No" />
        <Button.Rounded title="Yes" onClick={userAction} />
      </SW.Wrapper>
    );
  }
}
