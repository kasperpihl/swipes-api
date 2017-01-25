import React, { Component, PropTypes } from 'react';
import Button from 'Button';
import { bindAll } from 'classes/utils';

import './styles/input-menu.scss';

class InputMenu extends Component {
  constructor(props) {
    super(props);
    this.state = { text: '' };
    bindAll(this, ['onAdd', 'onHandleKeyUp', 'onChange']);
  }
  onHandleKeyUp(e) {
    if (e.keyCode === 13) {
      this.onAdd();
    }
  }
  onChange(e) {
    this.setState({ text: e.target.value });
  }
  onAdd() {
    const { onResult, hide } = this.props;
    let { text } = this.state;

    if (text && text.length) {
      text = text.trim();

      onResult(text);
      hide();
    }
  }
  render() {
    const { placeholder, buttonLabel, buttonIcon } = this.props;
    const { text } = this.state;

    return (
      <div className="input-menu">
        <input
          key="input"
          value={text}
          onChange={this.onChange}
          className="input-menu__input"
          placeholder={placeholder}
          onKeyUp={this.onHandleKeyUp}
          type="text"
          autoFocus
        />
        <Button
          primary
          key="butt"
          text={buttonLabel}
          disabled={!text.length}
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
  hide: func,
  onResult: func,
};
