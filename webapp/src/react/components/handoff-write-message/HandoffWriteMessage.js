import React, { Component, PropTypes } from 'react';
import ReactTextarea from 'react-textarea-autosize';
import HOCAssigning from 'components/assigning/HOCAssigning';

import './styles/handoff-write-message.scss';

class HandoffWriteMessage extends Component {
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
  focus() {
    this.refs.textarea.focus();
  }
  renderTextfield() {
    const { text, disabled } = this.props;
    let className = 'handoff-write-message__textarea';

    if (disabled) {
      className += ' handoff-write-message__textarea--disabled';
    }

    return (
      <ReactTextarea
        className={className}
        value={text}
        disabled={disabled}
        minRows={2}
        maxRows={6}
        ref="textarea"
        onChange={this.onHandoffChange}
        placeholder="What message should be passed on to them?"
      />
    );
  }
  render() {
    const { userId } = this.props;
    return (
      <div className="handoff-write-message">
        <div className="handoff-write-message__image">
          <HOCAssigning assignees={[userId]} rounded size={24} />
        </div>
        {this.renderTextfield()}
      </div>
    );
  }
}

export default HandoffWriteMessage;

const { string, func, bool } = PropTypes;

HandoffWriteMessage.propTypes = {
  text: string,
  imgSrc: string,
  disabled: bool,
  onChange: func,
};
