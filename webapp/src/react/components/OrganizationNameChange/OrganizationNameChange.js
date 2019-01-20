import React, { PureComponent } from 'react';
import withLoader from 'src/react/_hocs/withLoader';
import SW from './OrganizationNameChange.swiss';

@withLoader
export default class OrganizationNameChange extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      inputValue: props.currentName
    };
  }
  handleInput = e => {
    this.setState({ inputValue: e.target.value });
  };

  handleCallback = e => {
    const { hideModal, callback, orgId } = this.props;
    const { inputValue } = this.state;

    if (!e.keyCode || e.keyCode === 13) {
      callback('organization.rename', {
        organization_id: orgId,
        name: inputValue
      });
      hideModal();
    }
  };

  render() {
    const { hideModal, input } = this.props;

    return (
      <SW.Wrapper>
        <SW.Title>{input.title}</SW.Title>
        <SW.InputContainer>
          <SW.Input
            type={input.type}
            placeholder={input.placeholder}
            onChange={this.handleInput}
            onKeyUp={this.handleCallback}
            value={this.state.inputValue}
            autoFocus
          />
        </SW.InputContainer>
        <SW.ButtonWrapper>
          <SW.Button title="Cancel" rounded onClick={hideModal} />
          <SW.Button title="Confirm" rounded onClick={this.handleCallback} />
        </SW.ButtonWrapper>
      </SW.Wrapper>
    );
  }
}
