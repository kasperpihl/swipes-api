import React, { PureComponent } from 'react'
import { setupDelegate } from 'react-delegate';
import { miniIconForId, attachmentIconForService } from 'swipes-core-js/classes/utils';
import Button from 'src/react/components/button/Button';
import HOCAttachButton from 'src/react/components/attach-button/AttachButton';
import AutoCompleteInput from 'src/react/components/auto-complete-input/AutoCompleteInput';
import PostAttachment from '../post-components/post-attachment/PostAttachment';
import HOCAssigning from 'src/react/components/assigning/HOCAssigning';
import SW from './PostCreate.swiss';

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
      <SW.ActionBar>
        <SW.AssignSection>
          <HOCAssigning
            assignees={post.get('taggedUsers')}
            delegate={delegate}
            size={24}
            buttonProps={buttonProps}
            maxImages={9}
          />
        </SW.AssignSection>
        <SW.Seperator />
        <SW.AttachSection notEmpty={hasAttachments}>
          {this.renderContext()}
          {this.renderAttachments()}
          <HOCAttachButton
            delegate={delegate}
            sideLabel={!hasAttachments && 'Attach'}
            compact={hasAttachments}
          />
        </SW.AttachSection>
        <Button
          title="Post"
          onClick={this.onPostClick}
          {...getLoading('post') }
        />
      </SW.ActionBar>
    )
  }
  render() {
    const { myId, post } = this.props;
    const placeholder = `What do you want to discuss, ${msgGen.users.getFirstName(myId)}?`;

    return (
      <SW.Wrapper>
        <SW.ComposerWrapper>
          <HOCAssigning
            assignees={[myId]}
            size={36}
          />
          <SW.InputWrapper>
            <AutoCompleteInput
              innerRef={(c) => { this.input = c; }}
              onChange={this.onMessageChange}
              placeholder={placeholder}
              onAutoCompleteSelect={this.onAutoCompleteSelect}
              autoFocus
            />
          </SW.InputWrapper>
        </SW.ComposerWrapper>
        {this.renderActionBar()}
      </SW.Wrapper>
    )
  }
}

export default PostCreate
