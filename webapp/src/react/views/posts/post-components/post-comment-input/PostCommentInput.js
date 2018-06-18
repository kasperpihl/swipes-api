import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { styleElement } from 'swiss-react';
import { fromJS } from 'immutable';
import { setupCachedCallback } from 'react-delegate';
import { attachmentIconForService } from 'swipes-core-js/classes/utils';
import AutoCompleteInput from 'components/auto-complete-input/AutoCompleteInput';
import * as linkActions from 'src/redux/link/linkActions';
import * as ca from 'swipes-core-js/actions';
import HOCAssigning from 'components/assigning/HOCAssigning';
import HOCAttachButton from 'src/react/components/attach-button/AttachButton';
import Button from 'src/react/components/button/Button';
import editorStateToPlainMention from 'src/utils/draft-js/editorStateToPlainMention';
import PostAttachment from '../post-attachment/PostAttachment';
import navWrapper from 'src/react/app/view-controller/NavWrapper';

import styles from './PostCommentInput.swiss';

const Container = styleElement('div', styles.Container);
const Picture = styleElement('div', styles.Picture);
const Content = styleElement('div', styles.Content);
const Actions = styleElement('div', styles.Actions);
const Attachments = styleElement('div', styles.Attachments);
const TypingRow = styleElement('div', styles.TypingRow);
const SubmitButton = styleElement(Button, styles.SubmitButton);

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
      <Attachments>
        {attachments.map((att, i) => (
          <PostAttachment
            title={att.get('title')}
            key={i}
            onClick={this.onAttachmentClickCached(i)}
            onClose={this.onAttachmentCloseCached(i)}
            icon={attachmentIconForService(att.getIn(['link', 'service']))}
          />
        )).toArray()}
      </Attachments>
    );
  }

  render() {
    const { hasContent } = this.state;
    console.log(hasContent);
    const { myId } = this.props;
    const placeholder = 'Write a comment';

    return (
      <Container>
        <Picture>
          <HOCAssigning assignees={[myId]} size={36} />
        </Picture>
        <Content>
          <TypingRow>
            <AutoCompleteInput
              innerRef={c => this.textarea = c}
              placeholder={placeholder}
              handleReturn={this.onReturn}
              onChange={this.onChange}
              reset={this.state.resetDate}
            />
            <HOCAttachButton
              delegate={this}
              compact
            />
            <SubmitButton
              onClick={this.onAddComment}
              icon="Enter"
              compact
              shown={hasContent}
            />
          </TypingRow>
          {this.renderAttachments()}
        </Content>
      </Container>
    )
  }
}
