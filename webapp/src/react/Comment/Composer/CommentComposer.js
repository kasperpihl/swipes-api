import React, { PureComponent } from 'react';
import { List } from 'immutable';

import EmojiPicker from 'src/react/_components/EmojiPicker/EmojiPicker';
import UserImage from 'src/react/_components/UserImage/UserImage';
import AttachButton from 'src/react/_components/AttachButton/AttachButton';
import Button from 'src/react/_components/Button/Button';
import Attachment from 'src/react/_components/attachment/Attachment';

import cachedCallback from 'src/utils/cachedCallback';
import contextMenu from 'src/utils/contextMenu';
import request from 'core/utils/request';
import withLoader from 'src/react/_hocs/withLoader';

import SW from './CommentComposer.swiss';
import GiphySelector from 'src/react/_components/GiphySelector/GiphySelector';

@withLoader
export default class CommentComposer extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      attachments: List(props.initialAttachments || []),
      commentVal: props.initialMessage || ''
    };
  }
  handleChange = e => {
    const { onChangeMessage } = this.props;
    if (typeof onChangeMessage === 'function') {
      onChangeMessage(e.target.value);
    }
    this.setState({ commentVal: e.target.value });
  };
  handleEditComment = () => {
    const { attachments, commentVal } = this.state;
    const { discussionId, editCommentId, onSuccess, loader } = this.props;
    loader.set('editing');
    request('comment.edit', {
      discussion_id: discussionId,
      comment_id: editCommentId,
      message: commentVal,
      attachments
    }).then(res => {
      if (res.ok) {
        loader.clear('editing');
        window.analytics.sendEvent('Comment edited', {});
        if (typeof onSuccess === 'function') {
          onSuccess();
        }
      } else {
        loader.error('editing', res.error);
      }
    });
  };
  handleAddComment = message => {
    const { attachments, commentVal } = this.state;
    const { discussionId, editCommentId, onSuccess } = this.props;
    if (!message) {
      return;
    }
    if (editCommentId) {
      return this.handleEditComment();
    }
    this.setState({
      attachments: List([]),
      commentVal: ''
    });

    request('comment.add', {
      discussion_id: discussionId,
      attachments,
      message
    }).then(res => {
      if (res.ok) {
        window.analytics.sendEvent('Comment added', {});
        if (typeof onSuccess === 'function') {
          onSuccess();
        }
      }
    });
  };
  handleKeyDown = e => {
    if (e.keyCode === 13 && !e.shiftKey) {
      e.preventDefault();
      this.handleAddComment(this.state.commentVal);
    }
  };
  handleCloseAttachmentCached = cachedCallback(i => {
    this.setState({
      attachments: this.state.attachments.delete(i)
    });
  });
  handleAttach = att => {
    let { attachments } = this.state;

    attachments = attachments.push(att);
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

  openGiphySelector = e => {
    contextMenu(GiphySelector, e, {
      onEntrySelect: this.onEntrySelect
    });
  };

  onEntrySelect = entry => {
    this.handleAddComment(
      `<!giphy|${entry.images.downsized.url}|h:${
        entry.images.downsized.height
      },w:${entry.images.downsized.width}>`
    );
    contextMenu(null);
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
    const { ownedBy, loader } = this.props;
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
              <Button icon="Emoji" onClick={this.openGiphySelector} />
              <Button icon="Emoji" onClick={this.openEmojiPicker} />
              <AttachButton onAttach={this.handleAttach} ownedBy={ownedBy} />
              <SW.SubmitButton
                onClick={() => this.handleAddComment(commentVal)}
                icon="Enter"
                shown={!!commentVal}
                status={loader.get('editing')}
              />
            </SW.ButtonWrapper>
          </SW.TypingRow>
          {this.renderAttachments()}
        </SW.Content>
      </SW.Container>
    );
  }
}
