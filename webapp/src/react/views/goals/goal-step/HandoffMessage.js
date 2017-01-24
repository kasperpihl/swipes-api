import React, { Component, PropTypes } from 'react';
import ReactTextarea from 'react-textarea-autosize';

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
    return (
      <ReactTextarea
        className="add-goal__handoff"
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
        {this.renderTextfield()}
      </div>
    );
  }
}

export default HandoffMessage;

const { string, func, bool } = PropTypes;

HandoffMessage.propTypes = {
  text: string.isRequired,
  disabled: bool,
  onChange: func,
};
