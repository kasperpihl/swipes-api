import React, { Component } from 'react';
import PropTypes from 'prop-types';
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
      onChange();
    }
  }
  render() {
    const { label, checked, disable } = this.props;
    let className = 'input-check-demo';

    if (checked) {
      className += ' input-check-demo--checked'
    }
    

/*        <input
          ref="checkboxInput"
          checked={checked}
          onChange={this.onChange}
          type="checkbox"
          className="sw-checkbox__input"
          disabled={!!disable}
        />*/

    return (
      <div className="sw-checkbox">

        <div className={className} onClick={this.onChange}>
          <Icon icon="ChecklistCheckmark" className="sw-checkbox__icon" />
        </div>
        <div className="sw-checkbox__label">{label}</div>
      </div>
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
