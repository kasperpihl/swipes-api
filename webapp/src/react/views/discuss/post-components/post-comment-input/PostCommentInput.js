import React, { PureComponent } from 'react'
import { styleElement } from 'react-swiss';
import { fromJS } from 'immutable';
import { setupDelegate } from 'react-delegate';
import { MentionsInput, Mention } from 'react-mentions';
import { getDeep } from 'swipes-core-js/classes/utils';
import AutoCompleteInput from 'components/auto-complete-input/AutoCompleteInput';
import HOCAssigning from 'components/assigning/HOCAssigning';
import HOCAttachButton from 'components/attachments/HOCAttachButton';
import Button from 'src/react/components/button/Button2';
import styles from './PostCommentInput.swiss';

const Container = styleElement('div', styles.Container);
const Picture = styleElement('div', styles.Picture);
const Content = styleElement('div', styles.Content);
const Actions = styleElement('div', styles.Actions);
const Attachments = styleElement('div', styles.Attachments);
const StyledMentions = styleElement(MentionsInput, styles.StyledMentions);
const StyledMention = styleElement(Mention, styles.StyledMention);


class PostCommentInput extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      message: '<!U1234|Kasper> hi man',
      attachments: fromJS([]),
    };

    setupDelegate(this, 'onAddComment', 'onSearch');
    this.acOptions = {
      types: ['users'],
      delegate: this,
      trigger: "@",
    }
  }
  onTextareaFocus = () => {
    const { textarea } = this.refs;
    textarea.focus();
  }
  onSend = (e) => {
    const { message, attachments } = this.state;
    if(message.length) {
      this.onAddComment(message, attachments.toJS(), e);
      this.setState({ message: '', attachments: fromJS([]) });
    }
  }
  onKeyDown = (e) => {
    if (e.keyCode === 13 && !e.shiftKey) {
      e.preventDefault();
      this.onSend();
    }
  }
  onCommentChange = (e, newValue, plainTextValue) => {
    this.plainTextValue = plainTextValue;
    this.setState({ message: newValue });
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
  onAutoCompleteSelect(item, selectionIndex) {
    let { message } = this.state;
    const firstName = msgGen.users.getFirstName(item.id);

    const messageUntilCursor = message.slice(0, selectionIndex);

    const atIndex = messageUntilCursor.lastIndexOf('@');
    const messageLength = messageUntilCursor.length - atIndex;

    console.log(this.textarea);
    this.textarea.wrappedInstance.addMention(
      {
        id: item.id,
        display: firstName,
      }, {
        mentionDescriptor: this.textarea.props.children,
        querySequenceStart: atIndex,  
        querySequenceEnd: atIndex + messageLength,
        plainTextValue: this.plainTextValue,
      }
    )
    // this.setState({ message });
    return;
  }
  onAttachButtonCloseOverlay() {
    const input = getDeep(this, 'refs.textarea.refs.input.htmlEl');
    if(input) {
      // this.placeCaretAtEnd(input);
    }
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
          <HOCAssigning assignees={[myId]} rounded size={36} />
        </Picture>
        <Content>
          <StyledMentions
            placeholder={placeholder}
            markup="<!__id__|__display__>"
            onChange={this.onCommentChange}
            value={message}>
            <StyledMention
              trigger="@"
              data={this.onSearch}
            />
          </StyledMentions>
          {/*<AutoCompleteInput
            value={message}
            nodeType={StyledMentions}
            innerRef={(c) => { this.textarea = c; }}
            options={this.acOptions}
            placeholder={placeholder}
            onChange={this.onCommentChange}
            markup="<!__id__|__display__>"
            hasFocus={this.state.hasFocus}
            onKeyDown={this.onKeyDown}
            onFocus={() => this.setState({ hasFocus: true })}
            onBlur={() => this.setState({ hasFocus: false })}
            onSelect={this.onSelect}>
            <StyledMention
              trigger="@@"
              data={[]}
            />
          </AutoCompleteInput>*/}
        </Content>
      </Container>
    )
  }
}

export default PostCommentInput
