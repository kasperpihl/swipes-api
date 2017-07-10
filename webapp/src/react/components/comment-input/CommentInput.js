import React, { PureComponent } from 'react'
// import PropTypes from 'prop-types';
// import { map, list } from 'react-immutable-proptypes';
import { bindAll, setupDelegate, setupCachedCallback } from 'swipes-core-js/classes/utils';
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

    bindAll(this, ['onCommentChange', 'handleAttach', 'handleSend', 'handleKeyDown', 'handleTextareaFocus']);
  }
  componentDidMount() {

  }
  onCommentChange(e) {
    const value = e.target.value;

    this.setState({ commentText: value })
  }
  handleTextareaFocus() {
    const { textarea } = this.refs;

    textarea.focus();
  }
  handleAttach() {

  }
  handleSend() {

  }
  handleKeyDown(e) {
    if (e.keyCode === 13 && !e.shiftKey) {
      e.preventDefault();
      this.handleSend();
    }
  }
  renderImage() {
    const { me } = this.props;

    if (!me.get('id')) {
      console.error('Me not provided');

      return undefined;
    }

    const image = msgGen.users.getPhoto(me.get('id'));
    const initials = msgGen.users.getInitials(me.get('id'))

    if (image) {
      return <img src={image} className="comment-input__image" />
    }

    return <div className="comment-input__initials">KV</div>
  }
  renderIcons() {

    return (
      <div className="comment-input__icon-button" onClick={this.handleSend()}>
        <Icon icon="ArrowRightLine" className="comment-input__svg" />
      </div>
    )
  }
  render() {
    const { commentText } = this.state;
    const placeholder = 'Write a comment';

    return (
      <div className="comment-input">
        {this.renderImage()}
        <div className="comment-input__textarea-wrapper" onClick={this.handleTextareaFocus}></div>
        <ReactTextarea
          className="comment-input__textarea"
          value={commentText}
          minRows={1}
          maxRows={6}
          ref="textarea"
          onChange={this.onCommentChange}
          onKeyDown={this.handleKeyDown}
          placeholder={placeholder}
        />
        {this.renderIcons()}
      </div>
    )
  }
}

export default CommentInput
// const { string } = PropTypes;
CommentInput.propTypes = {};