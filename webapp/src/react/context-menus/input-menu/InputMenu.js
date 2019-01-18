import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Button from 'src/react/components/Button/Button';
import SW from './InputMenu.swiss';

class InputMenu extends Component {
  constructor(props) {
    super(props);
    this.state = { text: props.text || '' };
  }
  componentDidMount() {
    this.input.focus();
  }
  onHandleKeyUp = e => {
    if (e.keyCode === 13) {
      this.onAdd();
    }
  };
  onChange = e => {
    this.setState({ text: e.target.value });
  };
  onAdd = () => {
    const { onResult, hide, allowEmpty } = this.props;
    let { text } = this.state;

    if (allowEmpty || (text && text.length)) {
      text = text.trim();

      onResult(text);
      hide();
    }
  };
  render() {
    const { placeholder, buttonLabel, buttonIcon, allowEmpty } = this.props;
    const { text } = this.state;

    return (
      <SW.Wrapper>
        <SW.Input
          value={text}
          onChange={this.onChange}
          placeholder={placeholder}
          onKeyUp={this.onHandleKeyUp}
          type="text"
          autoFocus
          innerRef={c => (this.input = c)}
        />
        <Button
          title={buttonLabel}
          disabled={allowEmpty ? false : !text.length}
          icon={buttonIcon}
          onClick={this.onAdd}
        />
      </SW.Wrapper>
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
  onResult: func
};
