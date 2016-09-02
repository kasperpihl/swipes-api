import React, { Component, PropTypes } from 'react'
import { throttle, bindAll } from '../../classes/utils'
import moment from 'moment'
import Textarea from 'react-textarea-autosize'

class ChatInput extends Component {
  constructor(props) {
    super(props)
    this.defaultTextHeight = 60;
    this.state = { inputValue: '' }
    bindAll(this, ['onHeightChange', 'onSend', 'onAttach', 'onKeyDown', 'onKeyUp', 'onBlur', 'onFocus', 'onChange', 'onHeightChange', 'onFileChange', 'onPaste'])
  }
  componentDidMount() {
    if(this.props.sendTypingEvent){
      this.sendTypingEvent = throttle(this.props.sendTypingEvent, 3000, [{leading: true}]);
    }
    else{
      this.sendTypingEvent = () => {};
    }
  }
  componentDidUpdate(prevProps, prevState) {
    const { changedHeight } = this.props;

    if(changedHeight){
      const textHeight = this.state.inputTextHeight || 0;
      const height = Math.max(this.defaultTextHeight, textHeight);
      changedHeight(height);
    }

  }
  onKeyDown(e){
    if(e.keyCode === 13 && !e.shiftKey) {
      e.preventDefault();
    }
  }
  onKeyUp(e){
    const input = this.refs.input;
    const { sendMessage } = this.props;
    if(e.keyCode === 27){
      input.blur();
    }
    if (e.keyCode === 13 && !e.shiftKey ) {
      const message = input.value;
      if(message && message.length > 0 && !this.state.isSending){
        this.onSend(message);
      }
    }
    if (input.value.length > 0) {
       this.sendTypingEvent();
    }
  }
  onBlur(){
    this.setState({isFocused: false})
  }
  onFocus(){
    this.setState({isFocused: true})
  }
  onChange(event){
    this.setState({ inputValue: event.target.value })
  }
  onHeightChange(height){
    this.setState({ inputTextHeight: height })
  }
  onSend(){
    let message = this.state.inputValue;
    if(!message.length){
      message = ":+1:";
    }
    this.props.sendMessage(message);
    this.setState({ inputValue: '' });
    this.refs.input.focus();
  }
  onAttach(){
    if(this.state.isUplading){
      return;
    }
    this.refs.file.click();
  }
  onFileChange(e){
    if(this.props.uploadFiles){
      this.props.uploadFiles(e.target.files);
      this.refs.file.value = "";
    }
  }
  onPaste(e) {
    const clipboard = (e.clipboardData || e.originalEvent.clipboardData);
    //console.log('paste', items, e.clipboardData);
    let items = clipboard.items;
    if(!items){
      return;
    }
    items = [ ...items ];
    //console.log(typeof items, Array.isArray(items) );
    const files = [];
    let hadTitle = false;
    items.forEach((item, i) => {
      console.log('item', item.kind);
      if (item.kind === 'file') {
        var blob = item.getAsFile();
        files.push(blob);
      }
      else {
        hadTitle = true;
        item.getAsString((text) => {
          if(files.length && this.props.uploadFiles){
            files[0].name = text;
            this.props.uploadFiles(files);
          }
        });
      }
    })

    if(files.length){
      e.preventDefault();
    }
    if(files.length && !hadTitle){
      files[0].name = 'Pasted image at' + moment().format('YYYY-MM-DD, h:mm A');

      if (this.state.inputValue && this.state.inputValue.length > 0) {
        files[0].name = this.state.inputValue;
        this.setState({inputValue: ''})
      }

      this.props.uploadFiles(files);
    }
  }
  renderTextarea(){
    return (
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
    )
  }
  renderSendButton(){
    const sendIcon = (this.state.inputValue.length > 0) ? "send" : "thumb_up";
    return (
      <div onClick={this.onSend} className="action-button send-button">
        <i className="material-icons">{sendIcon}</i>
      </div>
    )
  }
  renderAttachButton(){
    return [
      <input key="real-input" ref="file" type="file" onChange={this.onFileChange} className="file-input" />,

      <div key="attach-button" onClick={this.onAttach} className="action-button attach-icon">
        <i className="material-icons">attach_file</i>
      </div>
    ];
  }
  render() {
    const textHeight = this.state.inputTextHeight || 0;
    const height = Math.max(this.defaultTextHeight, textHeight);

    let className = "chat-input";
    if(this.state.isFocused){
      className += " focused";
    }

    return (
      <div className={className} style={{height: height + 'px'}}>
        {this.renderAttachButton()}
        {this.renderTextarea()}
        {this.renderSendButton()}
      </div>
    );
  }
}
export default ChatInput

ChatInput.propTypes = {
  isUploading: PropTypes.bool,
  isSending: PropTypes.bool,
  sendMessage: PropTypes.func.isRequired,
  changedHeight: PropTypes.func,
  sendTypingEvent: PropTypes.func
}
