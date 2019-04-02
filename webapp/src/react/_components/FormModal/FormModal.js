import React, { PureComponent, Fragment } from 'react';
import withLoader from 'src/react/_hocs/withLoader';
import InputText from '_shared/Input/Text/InputText';
import Spacing from '_shared/Spacing/Spacing';
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
      const { label, initialValue, nameChange, ...rest } = comp;
      return (
        <Fragment key={i}>
          <SW.InputWrapper nameChange={nameChange}>
            <InputText
              type="text"
              onChange={this.handleInputCached(i)}
              onKeyDown={this.handleKeyDownCached(i)}
              placeholder={label}
              value={this.state[i]}
              {...rest}
            />
          </SW.InputWrapper>
        </Fragment>
      );
    });
  };

  render() {
    const {
      hideModal,
      title,
      subtitle,
      confirmLabel,
      alert,
      children
    } = this.props;

    return (
      <SW.Wrapper>
        <SW.Header>
          <SW.Title>{title}</SW.Title>
        </SW.Header>
        <SW.InputContainer>{this.renderInputs()}</SW.InputContainer>
        {!!subtitle && <SW.Subtitle>{subtitle}</SW.Subtitle>}
        {children}
        <SW.ButtonWrapper>
          {!alert ? (
            <>
              <SW.Button title="Cancel" onClick={hideModal} border />
              <SW.Button
                title={confirmLabel || 'Confirm'}
                onClick={this.handleConfirm}
                border
                green
              />
            </>
          ) : (
            <SW.Button title="Okay" onClick={hideModal} border />
          )}
        </SW.ButtonWrapper>
      </SW.Wrapper>
    );
  }
}
