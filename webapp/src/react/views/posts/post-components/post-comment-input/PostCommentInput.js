import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { fromJS } from 'immutable';
import { setupCachedCallback } from 'react-delegate';
import { attachmentIconForService } from 'swipes-core-js/classes/utils';
import AutoCompleteInput from 'components/auto-complete-input/AutoCompleteInput';
import * as linkActions from 'src/redux/link/linkActions';
import * as ca from 'swipes-core-js/actions';
import HOCAssigning from 'components/assigning/HOCAssigning';
import HOCAttachButton from 'src/react/components/attach-button/AttachButton';
import editorStateToPlainMention from 'src/utils/draft-js/editorStateToPlainMention';
import PostAttachment from '../post-attachment/PostAttachment';
import navWrapper from 'src/react/app/view-controller/NavWrapper';

import SW from './PostCommentInput.swiss';

@navWrapper
@connect(state => ({
  myId: state.getIn(['me', 'id']),
}), {
  addComment: ca.posts.addComment,
  preview: linkActions.preview,
})
export default class extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      attachments: fromJS([]),
      resetDate: new Date(),
    };
    this.onAttachmentCloseCached = setupCachedCallback(this.onAttachmentClose);
    this.onAttachmentClickCached = setupCachedCallback(this.onAttachmentClick);
  }
  componentDidMount() {
    if(this.props.autoFocus) {
      this.textarea.focus();
    }
  }
  onReturn = (e) => {
    if(!e.shiftKey) {
      this.onAddComment();
      return 'handled';
    }
  }
  onChange = (editorState) => {
    this.editorState = editorState;
    const hasContent = !!editorState.getCurrentContent().getPlainText().length;
    if(hasContent !== this.state.hasContent) {
      this.setState({
        hasContent,
      });
    }

  }
  onAddComment = () => {
    const { attachments } = this.state;
    const { addComment, postId } = this.props;
    const message = editorStateToPlainMention(this.editorState);
    if(!message.length) {
      return;
    }
    this.setState({
      resetDate: new Date(),
      attachments: fromJS([]),
      hasContent: false,
    });

    addComment({
      post_id: postId,
      attachments,
      message,
    }).then((res) => {
      if (res.ok) {
        window.analytics.sendEvent('Comment added', {});
      }
    })
  }
  onAttachmentClick = (i) => {
    const { preview, target } = this.props;
    const { attachments } = this.state;
    preview(target, attachments.get(i));
  }
  onAttachmentClose = (i) => {
    this.onAttachButtonCloseOverlay();
    this.setState({
      attachments: this.state.attachments.delete(i),
    });
  }
  onAddedAttachment(att) {
    let { attachments } = this.state;
    attachments = attachments.push(att);
    this.setState({ attachments });
  }
  onAttachButtonCloseOverlay() {
    this.textarea.focus();
  }

  renderAttachments() {
    const { attachments } = this.state;
    if(!attachments.size) {
      return undefined;
    }

    return (
      <SW.Attachments>
        {attachments.map((att, i) => (
          <PostAttachment
            title={att.get('title')}
            key={i}
            onClick={this.onAttachmentClickCached(i)}
            onClose={this.onAttachmentCloseCached(i)}
            icon={attachmentIconForService(att.getIn(['link', 'service']))}
          />
        )).toArray()}
      </SW.Attachments>
    );
  }

  render() {
    const { hasContent } = this.state;
    const { myId } = this.props;
    const placeholder = 'Write a comment';

    return (
      <SW.Container>
        <SW.Picture>
          <HOCAssigning assignees={[myId]} size={36} />
        </SW.Picture>
        <SW.Content>
          <SW.TypingRow>
            <AutoCompleteInput
              innerRef={c => this.textarea = c}
              placeholder={placeholder}
              handleReturn={this.onReturn}
              onChange={this.onChange}
              reset={this.state.resetDate}
            />
            <HOCAttachButton
              delegate={this}
              buttonProps={{compact: true}}
            />
            <SW.SubmitButton
              onClick={this.onAddComment}
              icon="Enter"
              compact
              shown={hasContent}
            />
          </SW.TypingRow>
          {this.renderAttachments()}
        </SW.Content>
      </SW.Container>
    )
  }
}
