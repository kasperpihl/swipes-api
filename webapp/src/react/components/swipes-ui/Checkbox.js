import React, { Component, PropTypes } from 'react';
import Icon from 'Icon';
import './styles/checkbox.scss';

class Checkbox extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.onChange = this.onChange.bind(this);
  }
  onChange() {
    const { onChange } = this.props;

    if (onChange) {
      onChange(this.refs.checkboxInput.checked);
    }
  }
  render() {
    const { label, checked, disable } = this.props;

    return (
      <label className="sw-checkbox">
        <input
          ref="checkboxInput"
          checked={checked}
          onChange={this.onChange}
          type="checkbox"
          className="sw-checkbox__input"
          disabled={!!disable}
        />
        <div className="sw-checkbox__indicator">
          <Icon svg="ChecklistCheckmark" className="sw-checkbox__icon" />
        </div>
        <div className="sw-checkbox__label">{label}</div>
      </label>
    );
  }
}

export default Checkbox;

const { string, bool, func } = PropTypes;

Checkbox.propTypes = {
  onChange: func,
  label: string,
  checked: bool,
  disable: bool,
};
