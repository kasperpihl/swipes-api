import React, { PureComponent } from 'react'
import { styleElement } from 'react-swiss';
import { setupDelegate } from 'react-delegate';
import { miniIconForId, attachmentIconForService } from 'swipes-core-js/classes/utils';
import Button from 'src/react/components/button/Button2';
import HOCAttachButton from 'components/attachments/HOCAttachButton';
import AutoCompleteInput from 'src/react/components/auto-complete-input/AutoCompleteInput2';
import PostAttachment from '../post-components/post-attachment/PostAttachment';
import HOCAssigning from 'src/react/components/assigning/HOCAssigning';
import styles from './PostCreate.swiss';

const Wrapper = styleElement('div', styles.Wrapper);
const ComposerWrapper = styleElement('div', styles.ComposerWrapper);
const TypeWrapper = styleElement('div', styles.TypeWrapper);
const ActionBar = styleElement('div', styles.ActionBar);
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
            rounded
            size={30}
          />
          <AutoCompleteInput
            wrapperRef={(c) => { this.input = c; }}
            onChange={this.onMessageChange}
            placeholder={placeholder}
            onAutoCompleteSelect={this.onAutoCompleteSelect}
          />
        </ComposerWrapper>
        {this.renderActionBar()}
      </Wrapper>
    )
  }
}

export default PostCreate
