import React, { PureComponent } from 'react';
import { SwissProvider } from 'swiss-react';
import { setupDelegate } from 'react-delegate';
import SW from './FloatingInput.swiss';

class FloatingInput extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      float: false,
      floatValue: 0 || props.value.length,
      visiblePassword: false,
    };
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.focus !== this.props.focus && !this.props.focus) {
      this.input.focus();
      this.setState({ float: true });
    }

    if (!this.props.value.length && nextProps.value.length) {
      this.setState({ floatValue: nextProps.value.length });
    }
  }
  floatFocus = () => {
    if (!this.state.float) {
      this.setState({ float: !this.state.float });
    }
  }
  floatBlur = () => {
    const inputVal = this.input.value.length;

    if (this.state.float) {
      this.setState({ float: !this.state.float });
    }

    this.setState({ floatValue: inputVal });
  }
  render() {
    const { inputKey, type, placeholder, value, inviteFormField, inputError, inputProps } = this.props;

    const { visiblePassword, float, floatValue } = this.state;
    return (
      <SwissProvider active={!!float} standBy={floatValue > 0} inviteFormField={inviteFormField} inputError={inputError} >
        <SW.Wrapper className={this.props.className}>
          <SW.Input
            innerRef={c => this.input = c}
            type={type}
            value={value}
            id={inputKey}
            onFocus={this.floatFocus}
            onBlur={this.floatBlur}
            onChange={this.props.onChange}
            autoComplete="off"
            {...inputProps}
          />
          <SW.Label htmlFor={inputKey}>{inputError || placeholder}</SW.Label>
        </SW.Wrapper>
      </SwissProvider>
    );
  }
}

export default FloatingInput;
