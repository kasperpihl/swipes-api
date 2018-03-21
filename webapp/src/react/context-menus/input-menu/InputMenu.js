import React, { Component } from 'react';
import { element } from 'react-swiss';
import PropTypes from 'prop-types';
import Button from 'Button';
import { bindAll } from 'swipes-core-js/classes/utils';

import sw from './InputMenu.swiss';

const Wrapper = element('div', sw.Wrapper);
const Input = element('input', sw.Input);

class InputMenu extends Component {
  constructor(props) {
    super(props);
    this.state = { text: props.text || '' };
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
    const { onResult, hide, allowEmpty } = this.props;
    let { text } = this.state;

    if (allowEmpty || (text && text.length)) {
      text = text.trim();

      onResult(text);
      hide();
    }
  }
  render() {
    const { placeholder, buttonLabel, buttonIcon, allowEmpty } = this.props;
    const { text } = this.state;

    return (
      <Wrapper>
        <Input
          value={text}
          onChange={this.onChange}
          placeholder={placeholder}
          onKeyUp={this.onHandleKeyUp}
          type="text"
          autoFocus
        />
        <Button
          primary
          text={buttonLabel}
          disabled={allowEmpty ? false : !text.length}
          icon={buttonIcon}
          onClick={this.onAdd}
        />
      </Wrapper>
    );
  }
}

export default InputMenu;

const { string, func, bool } = PropTypes;

InputMenu.propTypes = {
  placeholder: string,
  buttonLabel: string,
  buttonIcon: string,
  allowEmpty: bool,
  hide: func,
  onResult: func,
};
