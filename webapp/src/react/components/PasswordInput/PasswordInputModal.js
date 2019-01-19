import React, { PureComponent } from 'react';
import SW from './PasswordInputModal.swiss';

export default class PasswordInputModal extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      passwordInput: ''
    };
  }

  handleInputChange = e => {
    this.setState({ passwordInput: e.target.value });
  };

  handleSubmit = e => {
    const { hideModal, callback } = this.props;

    if (e.keyCode === 13) {
      callback(this.state.passwordInput);
      hideModal();
    }
  };

  render() {
    const { text, title, hideModal, callback } = this.props;
    return (
      <SW.Wrapper>
        <SW.Title>{title}</SW.Title>
        <SW.Text>{text}</SW.Text>
        <SW.PasswordInput
          type="password"
          placeholder="Enter password"
          value={this.state.passwordInput}
          onChange={this.handleInputChange}
          onKeyUp={this.handleSubmit}
          autoFocus
        />
        <SW.ButtonWrapper>
          <SW.Button title="Cancel" onClick={hideModal} />
          <SW.Button
            title="Confirm"
            onClick={() => {
              callback(this.state.passwordInput);
              hideModal();
            }}
          />
        </SW.ButtonWrapper>
      </SW.Wrapper>
    );
  }
}
