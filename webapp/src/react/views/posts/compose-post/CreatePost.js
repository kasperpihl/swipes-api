import React, { PureComponent } from 'react'
import { element } from 'react-swiss';
import { setupDelegate } from 'react-delegate';
import { miniIconForId, attachmentIconForService } from 'swipes-core-js/classes/utils';
import Button from 'src/react/components/button/Button2';
import Icon from 'Icon';
import HOCHeaderTitle from 'components/header-title/HOCHeaderTitle';
import HOCAttachButton from 'components/attachments/HOCAttachButton';
import HOCAttachmentItem from 'components/attachments/HOCAttachmentItem';
import AutoCompleteInput from 'src/react/components/auto-complete-input/AutoCompleteInput';
import HOCAssigning from 'src/react/components/assigning/HOCAssigning';

import PostComposer from './PostComposer';
import sw from './CreatePost.swiss';

import './styles/create-post.scss';

const Wrapper = element('div', sw.Wrapper);
const ComposerWrapper = element('div', sw.ComposerWrapper);
const StyledAutoCompleteInput = element(AutoCompleteInput, sw.AutoCompleteInput);

class CreatePost extends PureComponent {
  constructor(props) {
    super(props)
    setupDelegate(this, 'onButtonClick', 'onPostClick', 'onContextClick', 'onChangeFiles', 'onMessageChange');
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
  renderActions() {
    const { getLoading, delegate } = this.props;


    return (
      <div className="create-post__actions">
        <HOCAttachButton
          delegate={delegate}
          frameless
          text="Attach"
        />
        <Button
          text="Tag Colleagues"
          className="create-post__button"
          onClick={this.onButtonClickCached('users')}
          frameless
          icon="TagColleague"
        />
        <Button
          primary
          text="Post"
          onClick={this.onPostClick}
          {...getLoading('post') }
          className="create-post__button"
        />
      </div>
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
          <StyledAutoCompleteInput //ReactTextarea //
            value={post.get('message')}
            minRows={3}
            maxRows={9}
            onChange={this.onMessageChange}
            placeholder={placeholder}
            autoFocus
            options={this.acOptions}
          />
        </ComposerWrapper>
        {this.renderAttachments()}
        {this.renderActions()}
      </Wrapper>
    )
  }
}

export default CreatePost
