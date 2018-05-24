import React, { PureComponent } from 'react';
import { styleElement } from 'swiss-react';
import { setupDelegate } from 'react-delegate';
import { bindAll } from 'swipes-core-js/classes/utils';
import Icon from 'Icon';
import styles from './FloatingInput.swiss';

const Wrapper = styleElement('div', styles.Wrapper);

class FloatingInput extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      float: false,
      floatValue: 0 || props.value.length,
      visiblePassword: false,
    };
    bindAll(this, ['floatFocus', 'floatBlur']);
    setupDelegate(this, 'onClick', 'onChange');
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.focus !== this.props.focus && !this.props.focus) {
      this.refs.floatingInput.focus();
      this.setState({ float: true });
    }

    if (!this.props.value.length && nextProps.value.length) {
      this.setState({ floatValue: nextProps.value.length });
    }
  }
  floatFocus() {
    if (!this.state.float) {
      this.setState({ float: !this.state.float });
    }
  }
  floatBlur() {
    const input = this.refs.floatingInput;
    const inputVal = input.value.length;

    if (this.state.float) {
      this.setState({ float: !this.state.float });
    }

    this.setState({ floatValue: inputVal });
  }
  render() {
    const { inputKey, type, placeholder, value, props } = this.props;
    const { visiblePassword, float, floatValue } = this.state;

    return (
      <Wrapper active={!!float} standBy={floatValue > 0}>
        <input
          ref="floatingInput"
          type={type}
          value={value}
          id={inputKey}
          onFocus={this.floatFocus}
          onBlur={this.floatBlur}
          onChange={this.onChangeCached(inputKey)}
          autoComplete="off"
          {...props}
        />
        <label htmlFor={inputKey}>{placeholder}</label>
      </Wrapper>
    );
  }
}

export default FloatingInput;
