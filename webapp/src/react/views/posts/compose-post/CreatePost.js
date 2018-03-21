import React, { PureComponent } from 'react'
import { element } from 'react-swiss';
import { setupDelegate } from 'react-delegate';
import { miniIconForId, attachmentIconForService } from 'swipes-core-js/classes/utils';
import Button from 'src/react/components/button/Button2';
import HOCAttachButton from 'components/attachments/HOCAttachButton';
import ACInput from 'src/react/components/auto-complete-input/AutoCompleteInput';
import HOCAssigning from 'src/react/components/assigning/HOCAssigning';

import sw from './CreatePost.swiss';

const Wrapper = element('div');
const ComposerWrapper = element('div', sw.ComposerWrapper);
const StyledACInput = element(ACInput, sw.AutoCompleteInput);
const ActionBar = element('div', sw.ActionBar);
const AssignSection = element('div', sw.AssignSection);
const AttachSection = element('div', sw.AttachSection);
const Seperator = element('div', sw.Seperator);


class CreatePost extends PureComponent {
  constructor(props) {
    super(props)
    setupDelegate(this, 'onPostClick', 'onMessageChange', 'onAssign');
    this.acOptions = {
      types: ['users'],
      delegate: props.delegate,
      trigger: "@",
    }
  }
  renderSubtitle() {
    const { post } = this.props;
    if (!post.get('context')) {
      return undefined;
    }

    return (
      <div className="create-post__context" onClick={this.onContextClick}>
        <Icon icon={miniIconForId(post.getIn(['context', 'id']))} className="create-post__svg" />
        {post.getIn(['context', 'title'])}
      </div>
    )
  }
  renderAttachments() {
    const { post, delegate } = this.props;
    if(!post.get('attachments').size) {
      return undefined;
    }

    const attachments = post.get('attachments').map((att, i) => (
      <HOCAttachmentItem
        attachment={att}
        index={i}
        key={i}
        delegate={delegate}
      />
    ))
    return (
      <div className="create-post__attachments">
        {attachments}
      </div>
    )
  }
  renderActionBar() {
    const { getLoading, delegate, post } = this.props;
    const hasAssignees = post.get('taggedUsers') && !!post.get('taggedUsers').size;
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
        {hasAssignees && <Seperator />}
        <AttachSection>
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
        <ComposerWrapper>
          <HOCAssigning
            assignees={[myId]}
            rounded
            size={30}
          />
          <StyledAutoCompleteInput
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

export default CreatePost
