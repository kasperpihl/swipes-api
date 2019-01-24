import React, { PureComponent } from 'react';
import { fromJS } from 'immutable';
import cachedCallback from 'src/utils/cachedCallback';
import AutoCompleteInput from 'src/react/_components/auto-complete-input/AutoCompleteInput';
import UserImage from 'src/react/_components/UserImage/UserImage';
import AttachButton from 'src/react/_components/AttachButton/AttachButton';
import editorStateToPlainMention from 'src/utils/draft-js/editorStateToPlainMention';
import Attachment from 'src/react/_components/attachment/Attachment';
import navWrapper from 'src/react/_Layout/view-controller/NavWrapper';
import request from 'swipes-core-js/utils/request';

import SW from './CommentComposer.swiss';

@navWrapper
export default class CommentComposer extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      attachments: fromJS([]),
      resetDate: new Date()
    };
  }
  onReturn = e => {
    if (e.shiftKey) {
      this.handleAddComment();
      return 'handled';
    }
  };
  onChange = editorState => {
    this.editorState = editorState;
    const hasContent = !!editorState.getCurrentContent().getPlainText().length;
    if (hasContent !== this.state.hasContent) {
      this.setState({
        hasContent
      });
    }
  };
  handleAddComment = () => {
    const { attachments } = this.state;
    const { discussion } = this.props;
    const message = editorStateToPlainMention(this.editorState);
    if (!message.length) {
      return;
    }
    this.setState({
      resetDate: new Date(),
      attachments: fromJS([]),
      hasContent: false
    });

    request('comment.add', {
      discussion_id: discussion.get('discussion_id'),
      attachments,
      message
    }).then(res => {
      if (res.ok) {
        window.analytics.sendEvent('Comment added', {});
      }
    });
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
  onAttachButtonCloseOverlay() {
    this.textarea.focus();
  }

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
    const { hasContent } = this.state;
    const { discussion } = this.props;
    const placeholder = 'Write a comment';

    return (
      <SW.Container>
        <SW.Picture>
          <UserImage userId="me" size={36} />
        </SW.Picture>
        <SW.Content>
          <SW.TypingRow>
            <AutoCompleteInput
              innerRef={c => (this.textarea = c)}
              placeholder={placeholder}
              handleReturn={this.onReturn}
              onChange={this.onChange}
              reset={this.state.resetDate}
              autoFocus
            />
            <AttachButton
              onAttach={this.handleAttach}
              ownedBy={discussion.get('owned_by')}
            />
            <SW.SubmitButton
              onClick={this.handleAddComment}
              icon="Enter"
              shown={hasContent}
            />
          </SW.TypingRow>
          {this.renderAttachments()}
        </SW.Content>
      </SW.Container>
    );
  }
}
