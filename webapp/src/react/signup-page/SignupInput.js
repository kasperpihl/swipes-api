import React, { PureComponent } from 'react';
// import { map, list } from 'react-immutable-proptypes';
import { bindAll, setupDelegate } from 'swipes-core-js/classes/utils';
import Icon from 'Icon';
import './styles/signup-input.scss';

class SignupInput extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      float: false,
      floatValue: 0 || props.value.length,
      visiblePassword: false,
    };
    bindAll(this, ['floatFocus', 'floatBlur', 'showPassword', 'hidePassword']);
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
    const { inputKey, type, placeholder, value, props } = this.props;
    const { visiblePassword, float, floatValue } = this.state;
    let floatingClass = 'floating-input';
    let iconClass = 'floating-input__icon';
    let newType = type;

    if (float) {
      floatingClass += ' floating-input--active';
    }

    if (floatValue > 0) {
      floatingClass += ' floating-input--standby';
    }

    if (type === 'password' && value.length > 0) {
      iconClass += ' floating-input__icon--visible';
      newType = visiblePassword ? 'text' : type;
    }

    return (
      <div className={floatingClass}>
        <input
          ref="floatingInput"
          type={newType}
          value={value}
          id={inputKey}
          onFocus={this.floatFocus}
          onBlur={this.floatBlur}
          onChange={this.onChangeCached(inputKey)}
          className="floating-input__input"
          autoComplete="off"
          {...props}
        />
        <label htmlFor={inputKey}>{placeholder}</label>

        <div
          className={iconClass}
          onMouseDown={this.showPassword}
          onMouseUp={this.hidePassword}
          onMouseLeave={this.hidePassword}
        >
          <Icon icon="Eye" className="floating-input__svg" />
        </div>
      </div>
    );
  }
}

export default SignupInput;

// const { string } = PropTypes;

SignupInput.propTypes = {};
