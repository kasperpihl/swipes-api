import React, { Component, PropTypes } from 'react'
class ChatInput extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }
  componentDidMount() {
  }
  render() {
    return (
      <div>
      </div>
    )
  }
}
export default ChatInput

ChatInput.propTypes = {
  removeThis: PropTypes.string.isRequired
}


var React = require('react');
var ChatInputStore = require('../stores/ChatInputStore');
var chatActions = require('../actions/ChatActions');

var FontIcon = require('material-ui/lib/font-icon');
var IconButton = require('material-ui/lib/icon-button');

import { throttle } from '../../classes/utils'
import Textarea from 'react-textarea-autosize'

var CircularProgress = require('material-ui/lib/circular-progress');


var ChatInput = React.createClass({
  mixins: [ChatInputStore.connect()],
  hasShownHint: false,
  currentLength: 0,
  componentDidMount: function() {
    this.sendTypingEvent = throttle(chatActions.sendTypingEvent, 3000, [{leading: true}]);
  },
  onKeyDown: function(e){
    if(e.keyCode === 13 && !e.shiftKey) {
      e.preventDefault();
    }
  },
  onKeyUp: function(e){
    var input = this.refs.input;

    if(e.keyCode === 27){
      this.refs.input.blur();
    }
    if (e.keyCode === 13 && !e.shiftKey ) {
      var message = this.refs.input.value;
      if(message && message.length > 0 && !this.state.isSending){
        this.sendMessage(message);
      }
    }
    if (this.refs.input.value.length > 0) {
       this.sendTypingEvent();
    }
  },
  onClick: function(){
    var message = this.state.inputValue;
    if(!message.length){
      message = ":+1:";
    }
    this.sendMessage(message);
    this.refs.input.focus();
  },
  onAttach: function(){
    if(this.state.isUplading){
      return;
    }
    this.refs.file.click();
  },
  sendMessage: function(message){
    //this.refs.textfield.clearValue();
    this.props.onSendingMessage();
    chatActions.sendMessage(message, function(){
      this.setState({isSending: false});
    }.bind(this));
    chatInputActions.changeInputValue('');
  },
  onFileChange:function(e){
    var fileInput = this.refs.file;
    console.log(e.target.files);
    console.log('file changed hahaha', e);
    this.setState({isUploading: true});
    chatActions.uploadFile(e.target.files[0], function(){
      console.log('remove state');
      this.setState({isUploading: false});
    }.bind(this));
    fileInput.value = "";
  },
  onChange: function(event){
    chatInputActions.changeInputValue(event.target.value);
  },
  onHeightChange: function(height){
    chatInputActions.changeInputTextHeight(height);
  },
  onFocus:function(){
    chatInputActions.focus();
  },
  onBlur: function(){
    chatInputActions.blur();
  },
  componentDidUpdate(prevProps, prevState) {
    var defaultTextHeight = 60;
    var textHeight = this.state.inputTextHeight || 0;
    var height = Math.max(defaultTextHeight, textHeight);
      this.props.onRenderingInputHeight(height);
  },
  onPaste: function(e) {
    var items = (e.clipboardData || e.originalEvent.clipboardData).items;
    var message = this.state.inputValue;
    for (var index in items) {
      var item = items[index];
      if (item.kind === 'file') {
        this.setState({isUploading: true});
        var blob = item.getAsFile();
        chatActions.uploadClipboard(blob, message, function(){
          this.setState({isUploading: false});
          chatInputActions.changeInputValue('');
        }.bind(this))
      }
    }
  },
  render: function() {
    var defaultTextHeight = 60;
    var textHeight = this.state.inputTextHeight || 0;
    var height = Math.max(defaultTextHeight, textHeight);

    var sendIcon = (this.state.inputValue.length > 0) ? "send" : "thumb_up";
    var disabled = this.state.isSending ? true : false;
    var uploadButton = <FontIcon className="material-icons">attach_file</FontIcon>;
    if( this.state.isUploading )
      uploadButton = <CircularProgress color="#777" size={0.5} />;

    var className = "todo-input";
    if(this.state.isFocused){
      className += " focused";
    }

    return (
      <div className={className} style={{height: height + 'px'}}>
        <input ref="file" type="file" onChange={this.onFileChange} className="file-input" />
        <Textarea
          placeholder="Quick reply"
          id="chat-input"
          ref="input"
          onFocus={this.onFocus}
          onBlur={this.onBlur}
          onChange={this.onChange}
          onKeyDown={this.onKeyDown}
          onKeyUp={this.onKeyUp}
          onHeightChange={this.onHeightChange}
          onPaste={this.onPaste}
          value={this.state.inputValue}
          minRows={1}
          maxRows={6}>
        </Textarea>
        <div onClick={this.onAttach} className="action-button attach-icon">
          {uploadButton}
        </div>
        <div onClick={this.onClick} className="action-button send-button">
          <FontIcon className="material-icons">{sendIcon}</FontIcon>
        </div>
      </div>
    );
  }
});
module.exports = ChatInput;
