import React, { PureComponent } from 'react'
import { styleElement } from 'swiss-react';
import { setupDelegate } from 'react-delegate';
import { miniIconForId, attachmentIconForService } from 'swipes-core-js/classes/utils';
import Button from 'src/react/components/button/Button2';
import HOCAttachButton from 'src/react/components/attach-button/AttachButton';
import AutoCompleteInput from 'src/react/components/auto-complete-input/AutoCompleteInput';
import PostAttachment from '../post-components/post-attachment/PostAttachment';
import HOCAssigning from 'src/react/components/assigning/HOCAssigning';
import styles from './PostCreate.swiss';

const Wrapper = styleElement('div', styles.Wrapper);
const ComposerWrapper = styleElement('div', styles.ComposerWrapper);
const TypeWrapper = styleElement('div', styles.TypeWrapper);
const ActionBar = styleElement('div', styles.ActionBar);
const InputWrapper = styleElement('div', styles.InputWrapper);
const AssignSection = styleElement('div', styles.AssignSection);
const AttachSection = styleElement('div', styles.AttachSection);
const Seperator = styleElement('div', styles.Seperator);


class PostCreate extends PureComponent {
  constructor(props) {
    super(props)
    setupDelegate(this, 'onPostClick', 'onMessageChange', 'onAssign', 'onAttachmentClick', 'onContextClick', 'onAttachmentClose', 'onContextClose', 'onAutoCompleteSelect');
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
    const buttonProps = hasAssignees ? {
      compact: true,
    } : {
      sideLabel: 'Assign',
    };
    const hasAttachments = post.get('context') || post.get('attachments').size;

    return (
      <ActionBar>
        <AssignSection>
          <HOCAssigning
            assignees={post.get('taggedUsers')}
            delegate={delegate}
            size={24}
            buttonProps={buttonProps}
            maxImages={9}
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
      </ActionBar>
    )
  }
  render() {
    const { myId, post } = this.props;
    const placeholder = `What do you want to discuss, ${msgGen.users.getFirstName(myId)}?`;

    return (
      <Wrapper>
        <ComposerWrapper>
          <HOCAssigning
            assignees={[myId]}
            size={36}
          />
          <InputWrapper>
            <AutoCompleteInput
              wrapperRef={(c) => { this.input = c; }}
              onChange={this.onMessageChange}
              placeholder={placeholder}
              onAutoCompleteSelect={this.onAutoCompleteSelect}
              autoFocus
            />
          </InputWrapper>
        </ComposerWrapper>
        {this.renderActionBar()}
      </Wrapper>
    )
  }
}

export default PostCreate
