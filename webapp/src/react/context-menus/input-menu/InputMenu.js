import React, { Component, PropTypes } from 'react';
import Button from 'Button';
import { bindAll } from 'classes/utils';

import './styles/input-menu.scss';

class InputMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    bindAll(this, ['onAdd', 'onHandleKeyUp']);
  }
  onHandleKeyUp(e) {
    if (e.keyCode === 13) {
      this.onAdd();
    }
  }
  onAdd() {
    const { onClick } = this.props;
    let val = this._input.value;

    if (val && val.length) {
      val = val.trim();

      onClick(val);
    }
  }
  render() {
    const { placeholder, buttonLabel, buttonIcon } = this.props;

    return (
      <div className="input-menu">
        <input
          key="input"
          className="input-menu__input"
          placeholder={placeholder}
          onKeyUp={this.onHandleKeyUp}
          type="text"
          ref={(c) => { this._input = c; }}
        />
        <Button
          primary
          key="butt"
          text={buttonLabel}
          icon={buttonIcon}
          onClick={this.onAdd}
          className="input-menu__button"
        />
      </div>
    );
  }
}

export default InputMenu;

const { string, func } = PropTypes;

InputMenu.propTypes = {
  placeholder: string,
  buttonLabel: string,
  buttonIcon: string,
  onClick: func,
};
