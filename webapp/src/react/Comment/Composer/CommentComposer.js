import React, { PureComponent } from 'react';
import { fromJS } from 'immutable';
import cachedCallback from 'src/utils/cachedCallback';
import UserImage from 'src/react/_components/UserImage/UserImage';
import AttachButton from 'src/react/_components/AttachButton/AttachButton';
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
      discussion_id: discussion.get('discussion_id'),
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
              <AttachButton
                onAttach={this.handleAttach}
                ownedBy={discussion.get('owned_by')}
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
