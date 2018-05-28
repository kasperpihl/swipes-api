import React, { PureComponent } from 'react';
import { styleElement, SwissProvider } from 'swiss-react';
import { setupDelegate } from 'react-delegate';
import Icon from 'Icon';
import styles from './FloatingInput.swiss';

const Wrapper = styleElement('div', styles.Wrapper);
const Input = styleElement('input', styles.Input);
const Label = styleElement('label', styles.Label);

class FloatingInput extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      float: false,
      floatValue: 0 || props.value.length,
      visiblePassword: false,
    };
    setupDelegate(this, 'onClick', 'onChange');
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
    const { inputKey, type, placeholder, value, props } = this.props;
    const { visiblePassword, float, floatValue } = this.state;

    return (
      <SwissProvider active={!!float} standBy={floatValue > 0}>
        <Wrapper>
          <Input
            innerRef={c => this.input = c}
            type={type}
            value={value}
            id={inputKey}
            onFocus={this.floatFocus}
            onBlur={this.floatBlur}
            onChange={this.onChangeCached(inputKey)}
            autoComplete="off"
            {...props}
          />
          <Label htmlFor={inputKey}>{placeholder}</Label>
        </Wrapper>
      </SwissProvider>
    );
  }
}

export default FloatingInput;
