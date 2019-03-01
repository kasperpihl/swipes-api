import React, { PureComponent } from 'react';
import withLoader from 'src/react/_hocs/withLoader';
import SW from './FormModal.swiss';

@withLoader
export default class FormModal extends PureComponent {
  constructor(props) {
    super(props);
    const initialState = {};
    props.inputs &&
      props.inputs.forEach((comp, i) => {
        initialState[i] = comp.initialValue || '';
      });
    this.state = initialState;
  }
  handleInputCached = key => e => {
    this.setState({ [key]: e.target.value });
  };

  handleConfirm = e => {
    const { hideModal, inputs, onConfirm } = this.props;

    hideModal();
    onConfirm(inputs && inputs.map((comp, i) => this.state[i]));
  };

  handleKeyDownCached = i => e => {
    const { inputs, hideModal } = this.props;
    if (e.keyCode === 13 && i === inputs.length - 1) {
      e.preventDefault();
      this.handleConfirm();
    }
  };

  renderInputs = () => {
    const { inputs } = this.props;

    if (!inputs) {
      return null;
    }
    return inputs.map((comp, i) => {
      const { label, initialValue, ...rest } = comp;
      return (
        <SW.InputWrapper key={i}>
          {!!label && <SW.Label>{label}</SW.Label>}
          <SW.Input
            {...rest}
            onChange={this.handleInputCached(i)}
            onKeyDown={this.handleKeyDownCached(i)}
            value={this.state[i]}
          />
        </SW.InputWrapper>
      );
    });
  };

  render() {
    const { hideModal, title, subtitle, confirmLabel } = this.props;

    return (
      <SW.Wrapper>
        <SW.Title>{title}</SW.Title>
        {!!subtitle && <SW.Subtitle>{subtitle}</SW.Subtitle>}
        <SW.InputContainer>{this.renderInputs()}</SW.InputContainer>
        <SW.ButtonWrapper>
          <SW.Button title="Cancel" onClick={hideModal} />
          <SW.Button
            title={confirmLabel || 'Confirm'}
            onClick={this.handleConfirm}
          />
        </SW.ButtonWrapper>
      </SW.Wrapper>
    );
  }
}
