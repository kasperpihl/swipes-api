import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { styleElement } from 'react-swiss';
import { fromJS } from 'immutable';
import AutoCompleteInput from 'components/auto-complete-input/AutoCompleteInput';
import * as ca from 'swipes-core-js/actions';
import HOCAssigning from 'components/assigning/HOCAssigning2';
import HOCAttachButton from 'components/attachments/HOCAttachButton';
import Button from 'src/react/components/button/Button2';
import editorStateToPlainMention from 'src/utils/draft-js/editorStateToPlainMention';

import styles from './PostCommentInput.swiss';

const Container = styleElement('div', styles.Container);
const Picture = styleElement('div', styles.Picture);
const Content = styleElement('div', styles.Content);
const Actions = styleElement('div', styles.Actions);
const Attachments = styleElement('div', styles.Attachments);

class PostCommentInput extends PureComponent {
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
      console.log('send!');
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
      <Container>
        <Picture>
          <HOCAssigning assignees={[myId]} size={36} />
        </Picture>
        <Content>
          <AutoCompleteInput
            innerRef={c => this.textarea = c}
            placeholder={placeholder}
            onReturn={this.onReturn}
            onChange={this.onChange}
            reset={this.state.resetDate}
          />
        </Content>
      </Container>
    )
  }
}

export default connect(state => ({
  myId: state.getIn(['me', 'id']),
}), {
  addComment: ca.posts.addComment,
})(PostCommentInput);
