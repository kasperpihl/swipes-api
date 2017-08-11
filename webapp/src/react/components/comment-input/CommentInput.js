import React, { PureComponent } from 'react'
// import PropTypes from 'prop-types';
// import { map, list } from 'react-immutable-proptypes';
import { fromJS } from 'immutable';
import { bindAll, setupDelegate, setupCachedCallback, debounce, getDeep } from 'swipes-core-js/classes/utils';
import AutoCompleteInput from 'components/auto-complete-input/AutoCompleteInput';
import HOCAttachButton from 'components/attachments/HOCAttachButton';
import HOCAttachmentItem from 'components/attachments/HOCAttachmentItem';
import ReactTextarea from 'react-textarea-autosize';
// import SWView from 'SWView';
// import Button from 'Button';
import Icon from 'Icon';
import './styles/comment-input.scss';
class CommentInput extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      message: '',
      attachments: fromJS([]),
    };
    const { aCSearch } = props;
    this.bouncedSearch = debounce(aCSearch, 50);
    setupDelegate(this, 'onAddComment');
    this.acOptions = {
      types: ['users'],
      delegate: this,
      trigger: "@",
    }
    bindAll(this, ['onCommentChange', 'handleAttach', 'handleSend', 'handleKeyDown', 'handleTextareaFocus']);
  }
  componentDidUpdate() {
    const htmlEl = getDeep(this, 'refs.textarea.refs.input.htmlEl');
    if(this.forceToEnd && htmlEl){
      this.placeCaretAtEnd(htmlEl);
      this.forceToEnd = false;
    }
  }
  onAddedAttachment(att) {
    let { attachments } = this.state;
    attachments = attachments.push(att);
    this.setState({ attachments });
  }
  onCommentChange(e) {
    let value = e.target.value;
    if(value.substr(-4) === '</a>'){
      value = value + '<br />';
      this.forceToEnd = true;
    }

    this.setState({ message: value });

    //this.bouncedSearch(value, ['users'], e.target.getBoundingClientRect(), this);
  }
  onAutoCompleteSelect(item) {
    let { message } = this.state;
    const sel = window.getSelection();
    const firstName = msgGen.users.getFirstName(item.id);
    message = message.replace('&nbsp;', ' ');
    // message = message.replace(/\s/g, ' ');
    let index = message.lastIndexOf(sel.anchorNode.textContent.replace(/\s/g, ' '));

    if(index === -1) {
      return;
    }
    let testStr = message.substr(index, sel.anchorOffset);
    const atIndex = testStr.lastIndexOf('@');
    testStr = testStr.substr(atIndex);
    const aNode = `<a contenteditable="false" href="#" data-server="<!${item.id}|${firstName}>" style="display:inline-block;">${firstName}</a>&nbsp;`;
    message = message.substr(0, index + atIndex) + aNode + message.substr(index + atIndex + testStr.length);
    if(message.substr(-5) === '</a> '){
      message = message.substr(0, message.length - 1) + '&nbsp;';
    }
    this.forceToEnd = true;
    this.setState({ message });
  }
  handleTextareaFocus() {
    const { textarea } = this.refs;

    textarea.focus();
  }
  handleAttach() {

  }
  handleSend(e) {
    let { message, attachments } = this.state;
    message = message.replace(/<a.*?(<![A-Z0-9]*\|.*?>).*?>.*?<\/a>/gi, "$1");
    message = message.replace(/<br\s*\/?>/ig, "\r\n");
    message = message.replace('&nbsp;', ' ');
    this.onAddComment(message, attachments.toJS(), e);
    this.setState({ message: '', attachments: fromJS([]) });
  }
  handleKeyDown(e) {
    if (e.keyCode === 13 && !e.shiftKey) {
      e.preventDefault();
      this.handleSend();
    }
  }
  placeCaretAtEnd(el) {
    el.focus();
    const range = document.createRange();
    range.selectNodeContents(el);
    range.collapse(false);
    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
  }
  renderImage() {
    const { myId } = this.props;

    const image = msgGen.users.getPhoto(myId, 64);
    const initials = msgGen.users.getInitials(myId)

    if (image) {
      return <img src={image} className="comment-input__image" />
    }

    return <div className="comment-input__initials">{initials}</div>
  }
  renderIcons() {

    return (
      <div className="comment-input__icon-button">
        <Icon icon="Attach" className="comment-input__svg" />
      </div>
    )
  }
  renderAttachments() {
    const { attachments } = this.state;
    if(!attachments.size) {
      return undefined;
    }
    return (
      <div className="comment-input__attachments">
        {attachments.map((att, i) => (
          <HOCAttachmentItem attachment={att} key={i} />
        ))}
      </div>
    )
  }
  renderProfilePic() {
    const { myId } = this.props;
    const image = msgGen.users.getPhoto(myId);
    const initials = msgGen.users.getInitials(myId);

    if (!image) {
      return (
        <div className="comment-input__profile-initials">
          {initials}
        </div>
      )
    }

    return (
      <div className="comment-input__profile-pic">
        <img src={image} />
      </div>
    )
  }
  renderTextarea() {
    const { message } = this.state;
    const { delegate } = this.props;

    const placeholder = 'Write a comment';

    return (
      <div className="comment-input__textarea-wrapper">
        <AutoCompleteInput
          className="comment-input__textarea"
          html={message}
          ref="textarea"
          options={this.acOptions}
          onChange={this.onCommentChange}
          onKeyDown={this.handleKeyDown}
        />
        <div className={`comment-input__placeholder ${message.length ? '' : 'comment-input__placeholder--shown'}`}>
          {placeholder}
        </div>
        <HOCAttachButton
          delegate={this}
          frameless
        />
        {/* <div className="comment-input__icon-wrapper">
          <Icon icon="Attach" className="comment-input__svg" />
        </div> */}
      </div>
    )
  }
  render() {
    const { message } = this.state;
    const placeholder = 'Write a comment';

    return (
      <div className="comment-input">
        <div className="comment-input__section">
          {this.renderProfilePic()}
          {this.renderTextarea()}
        </div>
        <div className="comment-input__section">
          {this.renderAttachments()}
        </div>
      </div>
    )
  }
}

export default CommentInput
// const { string } = PropTypes;
CommentInput.propTypes = {};
