import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindAll } from 'swipes-core-js/classes/utils';
import Icon from 'Icon';
import './styles/floating-form-input.scss';

class FloatingInput extends Component {
  constructor(props) {
    super(props);
    this.state = {
      float: false,
      floatValue: 0 || props.value.length,
      visiblePassword: false,
    };

    bindAll(this, ['floatFocus', 'floatBlur', 'onChange', 'showPassword', 'hidePassword']);
  }
  componentWillReceiveProps(nextProps) {
    const currVal = this.props.value || '';
    const nextVal = nextProps.value || '';
  }
  onChange(e) {
    const { onChange } = this.props;
    if(onChange){
      onChange(e.target.value, e);
    }
  }
  floatFocus() {
    this.setState({ focus: true });
    if (!this.state.float) {
      this.setState({ float: !this.state.float });
    }
  }
  floatBlur() {
    this.setState({ focus: false });
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

    const { focus, visiblePassword } = this.state;
    let floatingClass = 'floating-form-label--inactive';
    let iconClass = 'floating-form-label__icon';
    let newType = type;

    if (focus) {
      floatingClass = 'floating-form-label--active';
    }

    if (value.length > 0) {
      floatingClass += ' floating-form-label--standby';
    }

    if (error) {
      floatingClass += ' floating-form-label--error';
    }

    if (type === 'password' && value.length > 0) {
      iconClass += ' floating-form-label__icon--visible';
      newType = visiblePassword ? 'text' : type;
    }

    return (
      <div className={`floating-form-label ${floatingClass}`}>
        <input
          ref="floatingInput"
          className="floating-form-label__input"
          value={value}
          type={newType}
          id={id}
          onFocus={this.floatFocus}
          onBlur={this.floatBlur}
          onKeyDown={this.props.onKeyDown}
          onChange={this.onChange}
        />
        <label htmlFor={id} className="floating-form-label__label">{label}</label>

        <div
          className={iconClass}
          onMouseDown={this.showPassword}
          onMouseUp={this.hidePassword}
          onMouseLeave={this.hidePassword}
        >
          <Icon icon="Eye" className="floating-form-label__svg" />
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
