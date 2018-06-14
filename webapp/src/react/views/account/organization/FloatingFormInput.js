import React, { Component } from 'react';
import { bindAll } from 'swipes-core-js/classes/utils';
import { SwissProvider } from 'swiss-react';
import PropTypes from 'prop-types';
import SW from './FloatingFormInput.swiss';

class FloatingInput extends Component {
  constructor(props) {
    super(props);
    this.state = {
      float: false,
      floatValue: 0 || props.value.length,
    };

    bindAll(this, ['floatFocus', 'floatBlur', 'onChange']);
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
  onChange = (e) => {
    const { onChange } = this.props;
    if(onChange){
      onChange(e.target.value, e);
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
    const { label, type, id, error, value } = this.props;
    const { float, floatValue } = this.state;

    return (
      <SwissProvider active={!!float} standBy={floatValue > 0}>
        <SW.Wrapper>
          <SW.Input
            innerRef={c => this.input = c}
            value={value}
            id={id}
            type={type}
            onFocus={this.floatFocus}
            onBlur={this.floatBlur}
            onKeyDown={this.props.onKeyDown}
            onChange={this.onChange}
          />
          <SW.Label htmlFor={id}>{label}</SW.Label>
        </SW.Wrapper>
      </SwissProvider>
    );
  }
}

export default FloatingInput;

