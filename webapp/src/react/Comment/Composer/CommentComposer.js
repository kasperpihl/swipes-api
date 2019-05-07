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
      commentVal: props.initialMessage || '',
      cursorIndex: 0,
      attachmentLoadingStatus: false
    };
  }
  componentDidMount() {
    window.addEventListener('beforeunload', this.handleBeforeUnload);
  }
  componentWillUnmount() {
    window.removeEventListener('beforeunload', this.handleBeforeUnload);
    this.handleBeforeUnload();
  }
  handleBeforeUnload = () => {
    const { onUnload } = this.props;
    if (onUnload) {
      onUnload(this.state.commentVal, this.state.attachments);
    }
  };
  handleChange = e => {
    const { onChangeMessage } = this.props;
    if (typeof onChangeMessage === 'function') {
      onChangeMessage(e.target.value);
    }
    this.setState({ commentVal: e.target.value });
  };
  handleEditComment = () => {
    const { attachments, commentVal } = this.state;
    const {
      discussionId,
      editCommentId,
      onSuccess,
      loader,
      ownedBy
    } = this.props;

    if (commentVal.trim().length === 0) {
      return;
    }

    loader.set('editing');
    request('comment.edit', {
      discussion_id: discussionId,
      comment_id: editCommentId,
      message: commentVal,
      attachments
    }).then(res => {
      if (res.ok) {
        loader.clear('editing');
        window.analytics.sendEvent('Comment edited', ownedBy);
        if (typeof onSuccess === 'function') {
          onSuccess();
        }
      } else {
        loader.error('editing', res.error);
      }
    });
  };
  handleAddComment = message => {
    const { attachments, commentVal, attachmentLoadingStatus } = this.state;
    const { discussionId, editCommentId, onSuccess, ownedBy } = this.props;
    if (!message || attachmentLoadingStatus) {
      return;
    }
    if (editCommentId) {
      return this.handleEditComment();
    }
    // if (commentVal.trim().length === 0) {
    //   return;
    // }
    this.setState({
      attachments: List([]),
      commentVal: ''
    });

    console.log('executed function');

    request('comment.add', {
      discussion_id: discussionId,
      attachments: attachments.toJS(),
      message
    }).then(res => {
      console.log(res);
      if (res.ok) {
        window.analytics.sendEvent('Comment sent', ownedBy);
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
  loadingAttachment = status => {
    this.setState({ attachmentLoadingStatus: status });
  };

  openEmojiPicker = e => {
    contextMenu(EmojiPicker, e, {
      onSelect: this.selectEmoji
    });
  };

  selectEmoji = emoji => {
    const newString =
      this.state.commentVal.substring(0, this.state.cursorIndex) +
      emoji.native +
      this.state.commentVal.substring(
        this.state.cursorIndex,
        this.state.commentVal.length
      );
    this.setState({ commentVal: newString });
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

  handleOnChange = e => {
    this.setState({
      commentVal: e.target.value,
      cursorIndex: e.target.selectionStart
    });
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
          <UserImage userId="me" size={30} />
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
              onChange={this.handleOnChange}
            />
            <SW.ButtonWrapper>
              <AttachButton
                onAttach={this.handleAttach}
                onStatusChange={this.loadingAttachment}
                ownedBy={ownedBy}
              />
              {!commentVal && (
                <Button icon="Gif" onClick={this.openGiphySelector} />
              )}
              <Button icon="Emoji" onClick={this.openEmojiPicker} />
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
