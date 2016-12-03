import React, { Component, PropTypes } from 'react';
import { bindAll } from '../../classes/utils';
import './styles/floating-input.scss';

class FloatingInput extends Component {
  constructor(props) {
    super(props);
    this.state = {
      float: false,
      floatValue: 0,
      value: null,
    };

    bindAll(this, ['floatFocus', 'floatBlur', 'onChange']);
  }
  onChange(e) {
    this.setState({ value: e.target.value });
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
    const { label, type, id } = this.props;
    let floatingClass = 'floating-label--inactive';

    if (this.state.float) {
      floatingClass = 'floating-label--active';
    }

    if (this.state.floatValue > 0) {
      floatingClass += ' floating-label--standby';
    }

    return (
      <div className={`floating-label ${floatingClass}`}>
        <input
          ref="floatingInput"
          className="floating-label__input"
          type={type}
          id={id}
          onFocus={this.floatFocus}
          onBlur={this.floatBlur}
          onChange={this.onChange}
        />
        <label htmlFor={id} className="floating-label__label">{label}</label>
      </div>
    );
  }
}

export default FloatingInput;

const { string } = PropTypes;

FloatingInput.propTypes = {
  label: string,
  type: string,
  id: string,
};
