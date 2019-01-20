import React, { PureComponent } from 'react';
import withLoader from 'src/react/_hocs/withLoader';
import SW from './FormModal.swiss';

@withLoader
export default class FormModal extends PureComponent {
  constructor(props) {
    super(props);
    const initialState = {};
    props.components &&
      props.components.forEach((comp, i) => {
        initialState[i] = comp.initialValue || '';
      });
    this.state = initialState;
  }
  handleInputCached = key => e => {
    this.setState({ [key]: e.target.value });
  };

  handleConfirm = e => {
    const { hideModal, components, onConfirm } = this.props;

    if (!e || !e.keyCode || e.keyCode === 13) {
      onConfirm(components && components.map((comp, i) => this.state[i]));
      hideModal();
    }
  };

  handleKeyUpCached = i => e => {
    const { components } = this.props;
    if (e.keyCode === 13 && i === components.length - 1) {
      this.handleConfirm();
    }
  };

  renderInputs = () => {
    const { components } = this.props;

    if (!components) {
      return null;
    }
    return components.map((comp, i) => {
      const { label, initialValue, ...rest } = comp;
      return (
        <SW.InputWrapper key={i}>
          {!!label && <SW.Label>{label}</SW.Label>}
          <SW.Input
            {...rest}
            onChange={this.handleInputCached(i)}
            onKeyUp={this.handleKeyUpCached(i)}
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
          <SW.Button title="Cancel" rounded onClick={hideModal} />
          <SW.Button
            title={confirmLabel || 'Confirm'}
            rounded
            onClick={this.handleConfirm}
          />
        </SW.ButtonWrapper>
      </SW.Wrapper>
    );
  }
}
