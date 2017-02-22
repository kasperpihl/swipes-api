import React, { Component, PropTypes } from 'react';
import { bindAll } from 'classes/utils';
import Icon from 'Icon';
import './styles/floating-input.scss';

class FloatingInput extends Component {
  constructor(props) {
    super(props);
    this.state = {
      float: false,
      floatValue: 0,
      visiblePassword: false,
    };

    bindAll(this, ['floatFocus', 'floatBlur', 'onChange', 'showPassword', 'hidePassword']);
  }
  onChange(e) {
    this.props.onChange(e.target.value, e);
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
  showPassword() {
    const { visiblePassword } = this.state;

    if (!visiblePassword) {
      this.setState({ visiblePassword: true });
    }
  }
  hidePassword() {
    const { visiblePassword } = this.state;

    if (visiblePassword) {
      this.setState({ visiblePassword: false });
    }
  }
  render() {
    const { label, type, id, error, value } = this.props;
    const { visiblePassword } = this.state;
    let floatingClass = 'floating-label--inactive';
    let iconClass = 'floating-label__icon';
    let newType = type;

    if (this.state.float) {
      floatingClass = 'floating-label--active';
    }

    if (this.state.floatValue > 0) {
      floatingClass += ' floating-label--standby';
    }

    if (error) {
      floatingClass += ' floating-label--error';
    }

    if (type === 'password' && value.length > 0) {
      iconClass += ' floating-label__icon--visible';
      newType = visiblePassword ? 'text' : type;
    }

    return (
      <div className={`floating-label ${floatingClass}`}>
        <input
          ref="floatingInput"
          className="floating-label__input"
          value={value}
          type={newType}
          id={id}
          onFocus={this.floatFocus}
          onBlur={this.floatBlur}
          onKeyDown={this.props.onKeyDown}
          onChange={this.onChange}
        />
        <label htmlFor={id} className="floating-label__label">{label}</label>

        <div className={iconClass} onMouseDown={this.showPassword} onMouseUp={this.hidePassword} onMouseLeave={this.hidePassword}>
          <Icon svg="Plus" className="floating-label__svg" />
        </div>
      </div>
    );
  }
}

export default FloatingInput;

const { string, func, bool } = PropTypes;

FloatingInput.propTypes = {
  label: string,
  value: string.isRequired,
  onChange: func.isRequired,
  onKeyDown: func,
  error: bool,
  type: string,
  id: string,
};
