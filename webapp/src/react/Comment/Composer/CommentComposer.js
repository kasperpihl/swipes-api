import React, { PureComponent } from 'react';
import { fromJS } from 'immutable';

import EmojiPicker from 'src/react/_components/EmojiPicker/EmojiPicker';
import UserImage from 'src/react/_components/UserImage/UserImage';
import AttachButton from 'src/react/_components/AttachButton/AttachButton';
import Button from 'src/react/_components/Button/Button';
import Attachment from 'src/react/_components/attachment/Attachment';

import cachedCallback from 'src/utils/cachedCallback';
import contextMenu from 'src/utils/contextMenu';
import request from 'core/utils/request';

import SW from './CommentComposer.swiss';

export default class CommentComposer extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      attachments: fromJS([]),
      commentVal: ''
    };
  }
  onChange = e => {
    this.setState({ commentVal: e.target.value });
  };
  handleAddComment = () => {
    const { attachments, commentVal } = this.state;
    const { discussion } = this.props;
    if (!commentVal.length) {
      return;
    }
    this.setState({
      attachments: fromJS([]),
      commentVal: ''
    });

    request('comment.add', {
      discussion_id: discussion.discussion_id,
      attachments,
      message: commentVal
    }).then(res => {
      if (res.ok) {
        window.analytics.sendEvent('Comment added', {});
      }
    });
  };
  handleKeyDown = e => {
    if (e.keyCode === 13 && !e.shiftKey) {
      e.preventDefault();
      this.handleAddComment();
    }
  };
  handleCloseAttachmentCached = cachedCallback(i => {
    this.setState({
      attachments: this.state.attachments.delete(i)
    });
  });
  handleAttach = att => {
    let { attachments } = this.state;
    attachments = attachments.push(fromJS(att));
    this.setState({ attachments });
  };

  openEmojiPicker = e => {
    contextMenu(EmojiPicker, e, {
      onSelect: this.selectEmoji
    });
  };

  selectEmoji = emoji => {
    this.setState({ commentVal: this.state.commentVal + emoji.native });
  };

  renderAttachments() {
    const { attachments } = this.state;
    if (!attachments.size) {
      return undefined;
    }

    return (
      <SW.Attachments>
        {attachments.map((att, i) => (
          <Attachment
            attachment={att}
            key={i}
            onClose={this.handleCloseAttachmentCached(i)}
          />
        ))}
      </SW.Attachments>
    );
  }

  render() {
    const { commentVal } = this.state;
    const { discussion } = this.props;
    const placeholder = 'Write a comment';

    return (
      <SW.Container>
        <SW.Picture>
          <UserImage userId="me" size={36} />
        </SW.Picture>
        <SW.Content>
          <SW.TypingRow>
            <SW.Textarea
              inputRef={c => (this.textarea = c)}
              placeholder={placeholder}
              onKeyDown={this.handleKeyDown}
              maxRows={8}
              value={commentVal}
              autoFocus
              onChange={e => this.setState({ commentVal: e.target.value })}
            />
            <SW.ButtonWrapper>
              <Button icon="Emoji" onClick={this.openEmojiPicker} />
              <AttachButton
                onAttach={this.handleAttach}
                ownedBy={discussion.owned_by}
              />
              <SW.SubmitButton
                onClick={this.handleAddComment}
                icon="Enter"
                shown={!!commentVal}
              />
            </SW.ButtonWrapper>
          </SW.TypingRow>
          {this.renderAttachments()}
        </SW.Content>
      </SW.Container>
    );
  }
}
