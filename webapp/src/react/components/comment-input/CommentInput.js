import React, { PureComponent } from 'react'
// import PropTypes from 'prop-types';
// import { map, list } from 'react-immutable-proptypes';
import { bindAll, setupDelegate, setupCachedCallback, debounce } from 'swipes-core-js/classes/utils';
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
      delegate: props.delegate,
      trigger: "@",
    }
    bindAll(this, ['onCommentChange', 'handleAttach', 'handleSend', 'handleKeyDown', 'handleTextareaFocus']);
  }
  onCommentChange(e) {
    const value = e.target.value;

    this.setState({ commentText: value });

    //this.bouncedSearch(value, ['users'], e.target.getBoundingClientRect(), this);
  }
  onAutoCompleteSelect(item) {
    console.log('item', item);
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
  renderImage() {
    const { myId } = this.props;

    const image = msgGen.users.getPhoto(myId);
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
        <ReactTextarea //AutoCompleteInput
          className="comment-input__textarea"
          value={commentText}
          minRows={1}
          maxRows={6}
          ref="textarea"
          // options={this.acOptions}
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
