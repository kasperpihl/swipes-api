import React, { PureComponent } from 'react'
import { element } from 'react-swiss';
import { setupDelegate } from 'react-delegate';
import { miniIconForId, attachmentIconForService } from 'swipes-core-js/classes/utils';
import Button from 'src/react/components/button/Button2';
import HOCAttachButton from 'components/attachments/HOCAttachButton';
import ACInput from 'src/react/components/auto-complete-input/AutoCompleteInput';
import PostAttachment from '../post-components/post-attachment/PostAttachment';
import HOCAssigning from 'src/react/components/assigning/HOCAssigning';
import PostType from '../post-components/post-type/PostType';

import sw from './PostCreate.swiss';

const Wrapper = element('div');
const ComposerWrapper = element('div', sw.ComposerWrapper);
const TypeWrapper = element('div', sw.TypeWrapper);
const StyledACInput = element(ACInput, sw.AutoCompleteInput);
const ActionBar = element('div', sw.ActionBar);
const AssignSection = element('div', sw.AssignSection);
const AttachSection = element('div', sw.AttachSection);
const Seperator = element('div', sw.Seperator);


class PostCreate extends PureComponent {
  constructor(props) {
    super(props)
    setupDelegate(this, 'onPostClick', 'onMessageChange', 'onAssign', 'onAttachmentClick', 'onContextClick', 'onAttachmentClose', 'onContextClose', 'onChooseNotificationType');
    this.acOptions = {
      types: ['users'],
      delegate: props.delegate,
      trigger: "@",
    }
  }
  renderContext() {
    const { post } = this.props;
    if (!post.get('context')) {
      return undefined;
    }

    return (
      <PostAttachment
        icon={miniIconForId(post.getIn(['context', 'id']))}
        title={post.getIn(['context', 'title'])}
        onClick={this.onContextClick}
        onClose={this.onContextClose}
        isContext
      />
    );
  }
  renderAttachments() {
    const { post, delegate } = this.props;
    if(!post.get('attachments').size) {
      return undefined;
    }

    return post.get('attachments').map((att, i) => {
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
    });
  }
  renderActionBar() {
    const { getLoading, delegate, post } = this.props;
    const hasAssignees = post.get('taggedUsers') && !!post.get('taggedUsers').size;
    const hasAttachments = post.get('context') || post.get('attachments').size
    return (
      <ActionBar>
        <AssignSection>
          {hasAssignees && (<HOCAssigning
            assignees={post.get('taggedUsers')}
            rounded
            delegate={delegate}
            size={24}
          />)}
          <Button
            sideLabel={!hasAssignees && 'Assign'}
            icon="Person"
            onClick={this.onAssignCached('0')}
            compact={hasAssignees}
          />
        </AssignSection>
        <Seperator />
        <AttachSection notEmpty={hasAttachments}>
          {this.renderContext()}
          {this.renderAttachments()}
          <HOCAttachButton
            delegate={delegate}
            sideLabel={!hasAttachments && 'Attach'}
            compact={hasAttachments}
          />
        </AttachSection>
        <Button
          title="Post"
          onClick={this.onPostClick}
          {...getLoading('post') }
        />
        <Button
          icon="Close"
          compact
          onClick={this.props.hideModal}
        />
      </ActionBar>
    )
  }
  render() {
    const { myId, post } = this.props;
    const placeholder = `What do you want to discuss, ${msgGen.users.getFirstName(myId)}?`;

    return (
      <Wrapper>
        <TypeWrapper>
          <PostType type={post.get('type')} onClick={this.onChooseNotificationType} />
        </TypeWrapper>
        <ComposerWrapper>
          <HOCAssigning
            assignees={[myId]}
            rounded
            size={30}
          />
          <StyledACInput
            acRef={(c) => { this.input = c; }}
            value={post.get('message')}
            minRows={3}
            maxRows={9}
            onChange={this.onMessageChange}
            placeholder={placeholder}
            autoFocus
            options={this.acOptions}
          />
        </ComposerWrapper>
        {this.renderActionBar()}
      </Wrapper>
    )
  }
}

export default PostCreate
