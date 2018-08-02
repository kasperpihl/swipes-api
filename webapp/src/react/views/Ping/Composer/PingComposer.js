import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { fromJS } from 'immutable';
import { setupCachedCallback } from 'react-delegate';
import { attachmentIconForService, setupLoading } from 'swipes-core-js/classes/utils';
import * as linkActions from 'src/redux/link/linkActions';
import * as ca from 'swipes-core-js/actions';
import withEmitter from 'src/react/components/emitter/withEmitter';

import SW from './PingComposer.swiss';
import navWrapper from 'src/react/app/view-controller/NavWrapper';
import AutoCompleteInput from 'src/react/components/auto-complete-input/AutoCompleteInput';
import Attachment from 'src/react/components/attachment/Attachment';

import Button from 'src/react/components/button/Button';
import AttachButton from 'src/react/components/attach-button/AttachButton';
import HOCAssigning from 'src/react/components/assigning/HOCAssigning';

@navWrapper
@connect((state) => ({
  users: state.users,
  orgId: state.me.getIn(['organizations', 0, 'id'])
}), {
  preview: linkActions.preview,
  request: ca.api.request,
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
    setupLoading(this);
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
  onSendPing = () => {
    const { request, orgId, setActiveItem } = this.props;
    const message = this.editorState.getCurrentContent().getPlainText();
    if(!message) {
      return;
    }
    this.setLoading('ping', 'Sending');
    setActiveItem(1);
    request('ping.send', {
      receivers: this.state.receivers.toJS(),
      organization_id: orgId,
      attachments: this.state.attachments.toJS(),
      message,
    }).then(res => {
      if(res.ok) {
        this.clearLoading('ping', 'Sent', 3000);
        this.setState({
          resetDate: new Date(),
          receivers: fromJS([]),
          attachments: fromJS([]),
        });
      } else {
        this.clearLoading('ping', '!Error');
      }
    })
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
      <SW.BarWrapper>
        <SW.Label>Attachments</SW.Label>
        {attachments.map((att, i) => {
          const icon = attachmentIconForService(att.getIn(['link', 'service']));
          return (
            <Attachment
              title={att.get('title')}
              key={i}
              onClick={this.onAttachmentClickCached(i)}
              onClose={this.onAttachmentCloseCached(i)}
              icon={icon}
            />
          )
        })}
      </SW.BarWrapper>
    );
  }
  renderQuickAddBar() {
    const { users } = this.props;
    const { receivers } = this.state;
    if(receivers.size) {
      return null;
    }
    return (
      <SW.QuickAddWrapper>
        <SW.Label>Quick add</SW.Label>
        {users.map((u, i) => (
          <SW.UserWrapper
            className="user-name-hover"
            key={i}
            onClick={this.onUserClickCached(u.get('id'))}>
            <HOCAssigning
              assignees={[u.get('id')]}
              size={30}
            />
            <SW.UserName>{msgGen.users.getFirstName(u)}</SW.UserName>
          </SW.UserWrapper>
        )).toArray().slice(0, 5)}
      </SW.QuickAddWrapper>
    )
  }
  renderComposeBar() {
    const { receivers, attachments, resetDate } = this.state;
    return (
      <SW.BarWrapper>
        <SW.Column none>
          <HOCAssigning
            assignees={receivers}
            size={36}
            maxImages={3}
            delegate={this}
          />
        </SW.Column>
        <SW.Column>
          <AutoCompleteInput
            innerRef={c => this.input = c}
            onChange={this.onMessageChange}
            placeholder="Pass on a quick message"
            reset={resetDate}
            handleReturn={this.onReturn}
            onAutoCompleteSelect={this.onAutoCompleteSelect}
            autoFocus
            clearMentions
          />
        </SW.Column>
        <SW.Column none>
          <AttachButton
            delegate={this}
            buttonProps={{compact: true}}
            dropTitle={'New Ping'}
          />
        </SW.Column>
        <SW.Column none hidden={!receivers.size && !this.getLoading('ping').success}>
          <Button
            title="Ping"
            {...this.getLoading('ping')}
            onClick={this.onSendPing}
          />
        </SW.Column>
      </SW.BarWrapper>
    );
  }
  render() {
    return (
      <SW.AbsoluteWrapper className="quick-add-hover">
        {this.renderComposeBar()}
        {this.renderAttachments()}
        {this.renderQuickAddBar()}
      </SW.AbsoluteWrapper>
    )
  }
}
