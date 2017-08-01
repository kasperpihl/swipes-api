import React, { PureComponent } from 'react'
// import PropTypes from 'prop-types';
// import { map, list } from 'react-immutable-proptypes';
import { bindAll, setupDelegate, setupCachedCallback, debounce, getDeep } from 'swipes-core-js/classes/utils';
import AutoCompleteInput from 'components/auto-complete-input/AutoCompleteInput';
import ReactTextarea from 'react-textarea-autosize';
// import SWView from 'SWView';
// import Button from 'Button';
import Icon from 'Icon';
import './styles/comment-input.scss';
class CommentInput extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      commentText: '',
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
  onCommentChange(e) {
    let value = e.target.value;
    if(value.substr(-4) === '</a>'){
      value = value + '<br />';
      this.forceToEnd = true;
    }
    console.log(value);
    this.setState({ commentText: value });

    //this.bouncedSearch(value, ['users'], e.target.getBoundingClientRect(), this);
  }
  onAutoCompleteSelect(id) {
    let { commentText } = this.state;
    const sel = window.getSelection();
    const firstName = msgGen.users.getFirstName(id);
    commentText = commentText.replace('&nbsp;', ' ');
    // commentText = commentText.replace(/\s/g, ' ');
    let index = commentText.lastIndexOf(sel.anchorNode.textContent.replace(/\s/g, ' '));

    if(index === -1) {
      return;
    }
    let testStr = commentText.substr(index, sel.anchorOffset);
    const atIndex = testStr.lastIndexOf('@');
    testStr = testStr.substr(atIndex);
    const aNode = `<a contenteditable="false" href="#" data-server="<!${id}|${firstName}>" style="display:inline-block;">${firstName}</a>&nbsp;`;
    commentText = commentText.substr(0, index + atIndex) + aNode + commentText.substr(index + atIndex + testStr.length);
    if(commentText.substr(-5) === '</a> '){
      commentText = commentText.substr(0, commentText.length - 1) + '&nbsp;';
    }
    this.forceToEnd = true;
    this.setState({ commentText });
  }
  handleTextareaFocus() {
    const { textarea } = this.refs;

    textarea.focus();
  }
  handleAttach() {

  }
  handleSend(e) {
    const { commentText } = this.state;

    this.onAddComment(commentText, e);
    this.setState({ commentText: '' });
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
    const { commentText } = this.state;

    const placeholder = 'Write a comment';

    return (
      <div className="comment-input__textarea-wrapper">
        <AutoCompleteInput //ReactTextarea //
          className="comment-input__textarea"
          html={commentText}
          // minRows={1}
          // maxRows={6}
          ref="textarea"
          options={this.acOptions}
          onChange={this.onCommentChange}
          onKeyDown={this.handleKeyDown}
          placeholder={placeholder}
        />

        {/*<div className="comment-input__icon-wrapper">
          <Icon icon="Attach" className="comment-input__svg" />
        </div>*/}
      </div>
    )
  }
  render() {
    const { commentText } = this.state;
    const placeholder = 'Write a comment';

    return (
      <div className="comment-input">
        {this.renderProfilePic()}
        {this.renderTextarea()}
      </div>
    )
  }
}

export default CommentInput
// const { string } = PropTypes;
CommentInput.propTypes = {};
