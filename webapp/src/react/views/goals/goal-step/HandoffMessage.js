import React, { Component, PropTypes } from 'react';
import ReactTextarea from 'react-textarea-autosize';

import './styles/handoff-message.scss';

class HandoffMessage extends Component {
  constructor(props) {
    super(props);
    this.onHandoffChange = this.onHandoffChange.bind(this);
  }
  componentDidMount() {
  }
  onHandoffChange(e) {
    const { onChange } = this.props;
    onChange(e.target.value);
  }
  renderTextfield() {
    const { text, disabled } = this.props;
    let className = 'handoff-message__textarea';

    if (disabled) {
      className += ' handoff-message__textarea--disabled';
    }

    return (
      <ReactTextarea
        className={className}
        value={text}
        disabled={disabled}
        minRows={3}
        maxRows={10}
        ref="textarea"
        onChange={this.onHandoffChange}
        placeholder="What message should be passed on to them?"
      />
    );
  }
  render() {
    return (
      <div className="handoff-message">
        <div className="handoff-message__image">
          <img src="https://s3.amazonaws.com/uifaces/faces/twitter/enda/128.jpg" />
        </div>
        {this.renderTextfield()}
      </div>
    );
  }
}

export default HandoffMessage;

const { string, func, bool } = PropTypes;

HandoffMessage.propTypes = {
  text: string,
  disabled: bool,
  onChange: func,
};
