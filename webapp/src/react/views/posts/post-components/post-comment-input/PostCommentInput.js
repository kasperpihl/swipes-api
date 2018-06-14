import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { fromJS } from 'immutable';
import AutoCompleteInput from 'components/auto-complete-input/AutoCompleteInput';
import * as ca from 'swipes-core-js/actions';
import HOCAssigning from 'components/assigning/HOCAssigning';
import HOCAttachButton from 'src/react/components/attach-button/AttachButton';
import Button from 'src/react/components/button/Button';
import editorStateToPlainMention from 'src/utils/draft-js/editorStateToPlainMention';

import SW from './PostCommentInput.swiss';

@connect(state => ({
  myId: state.getIn(['me', 'id']),
}), {
  addComment: ca.posts.addComment,
})
export default class extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      attachments: fromJS([]),
      resetDate: new Date(),
    };

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
  }
  onAddComment() {
    const { attachments } = this.state;
    const { addComment, postId } = this.props;
    const message = editorStateToPlainMention(this.editorState);
    this.setState({
      resetDate: new Date(),
    })

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
  onAttachmentClose(i) {
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
    
  }
  
  renderAttachments() {
    const { attachments } = this.state;
    if(!attachments.size) {
      return undefined;
    }
  }

  render() {
    const { message } = this.state;
    const { myId } = this.props;
    const placeholder = 'Write a comment';

    return (
      <SW.Container>
        <SW.Picture>
          <HOCAssigning assignees={[myId]} size={36} />
        </SW.Picture>
        <SW.Content>
          <AutoCompleteInput
            innerRef={c => this.textarea = c}
            placeholder={placeholder}
            handleReturn={this.onReturn}
            onChange={this.onChange}
            reset={this.state.resetDate}
          />
        </SW.Content>
      </SW.Container>
    )
  }
}
