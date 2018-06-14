import React, { PureComponent } from 'react';
import { styleElement } from 'swiss-react';
import { connect } from 'react-redux';
import { fromJS } from 'immutable';
import { setupCachedCallback } from 'react-delegate';
import { attachmentIconForService } from 'swipes-core-js/classes/utils';
import * as linkActions from 'src/redux/link/linkActions';
import withEmitter from 'src/react/components/emitter/withEmitter';

import styles from './PingComposer.swiss';
import navWrapper from 'src/react/app/view-controller/NavWrapper';
import AutoCompleteInput from 'src/react/components/auto-complete-input/AutoCompleteInput';
import PostAttachment from 'src/react/views/posts/post-components/post-attachment/PostAttachment';

import Button from 'src/react/components/button/Button';
import AttachButton from 'src/react/components/attach-button/AttachButton';
import HOCAssigning from 'src/react/components/assigning/HOCAssigning';

const AbsoluteWrapper = styleElement('div', styles.AbsoluteWrapper);
const BarWrapper = styleElement('div', styles.BarWrapper);
const QuickAddWrapper = styleElement('div', styles.QuickAddWrapper);
const Column = styleElement('div', styles.Column);
const Label = styleElement('div', styles.Label);
const UserWrapper = styleElement('div', styles.UserWrapper);
const UserName = styleElement('span', styles.UserName);

@navWrapper
@connect((state) => ({
  users: state.get('users'),
}), {
  preview: linkActions.preview,
})
@withEmitter
export default class extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      receivers: fromJS([]),
      attachments: fromJS([]),
    };
    this.onUserClickCached = setupCachedCallback(this.onUserClick);
    this.onAttachmentClickCached = setupCachedCallback(this.onAttachmentClick);
    this.onAttachmentCloseCached = setupCachedCallback(this.onAttachmentClose);

    props.addListener('ping-add-assignee', this.onAddAssignee);
  }
  onMessageChange = (editorState) => {
    this.editorState = editorState;
  }
  onAssigningClose(assignees) {
    if(assignees) {
      this.setState({ receivers: fromJS(assignees) });
    }
    this.input.focus();
  }
  onAddAssignee = (id) => { 
    let { receivers } = this.state;
    if(!receivers.contains(id)) {
      this.setState({ receivers: receivers.push(id) });
    }
    this.input.focus();
  }
  onAttachButtonCloseOverlay = () => {
    this.input.focus();
  }
  onAttachmentClose = (i) => {
    this.setState({ attachments: this.state.attachments.delete(i) });
    this.input.focus();
  }
  onAddedAttachment(att) {
    this.setState({ attachments: this.state.attachments.push(att) });
  }
  onAttachmentClick = (i) => {
    const { preview, target } = this.props;
    preview(target, this.state.attachments.get(i));
  }
  onAutoCompleteSelect = (item) => {
    this.onAddAssignee(item.id);
  }
  onUserClick = (id) => {
    this.setState({ receivers: this.state.receivers.push(id) });
    this.input.focus();
  }
  renderAttachments() {
    const { attachments } = this.state;
    if(!attachments.size) {
      return null;
    }

    return (
      <BarWrapper>
        <Label>Attachments</Label>
        {attachments.map((att, i) => {
          const icon = attachmentIconForService(att.getIn(['link', 'service']));
          return (
            <PostAttachment
              title={att.get('title')}
              key={i}
              onClick={this.onAttachmentClickCached(i)}
              onClose={this.onAttachmentCloseCached(i)}
              icon={icon}
            />
          )
        })}
      </BarWrapper>
    );
  }
  renderQuickAddBar() {
    const { users } = this.props;
    const { receivers } = this.state;
    if(receivers.size) {
      return null;
    }
    return (
      <QuickAddWrapper>
        <Label>Quick add</Label>
        {users.map((u, i) => (
          <UserWrapper
            className="user-name-hover"
            key={i}
            onClick={this.onUserClickCached(u.get('id'))}>
            <HOCAssigning 
              assignees={[u.get('id')]}
              size={30}
            />
            <UserName>{msgGen.users.getFirstName(u)}</UserName>
          </UserWrapper>
        )).toArray().slice(0, 5)}
      </QuickAddWrapper>
    )
  }
  renderComposeBar() {
    const { receivers, attachments } = this.state;

    return (
      <BarWrapper>
        <Column none>
          <HOCAssigning
            assignees={receivers}
            size={36}
            maxImages={3}
            delegate={this}
          />
        </Column>
        <Column>
          <AutoCompleteInput
            innerRef={c => this.input = c}
            onChange={this.onMessageChange}
            placeholder="Pass on a quick message"
            onAutoCompleteSelect={this.onAutoCompleteSelect}
            autoFocus
            clearMentions
          />
        </Column>
        <Column none>
          <AttachButton
            delegate={this}
            compact
          />
        </Column>
        <Column none hidden={!receivers.size}>
          <Button
            title="Ping"
          />
        </Column>
      </BarWrapper>
    );
  }
  render() {
    return (
      <AbsoluteWrapper className="quick-add-hover">
        {this.renderComposeBar()}
        {this.renderAttachments()}
        {this.renderQuickAddBar()}
      </AbsoluteWrapper>
    )
  }
}
