import React, { PureComponent } from 'react'
// import PropTypes from 'prop-types';
// import { map, list } from 'react-immutable-proptypes';
import { setupDelegate, miniIconForId, attachmentIconForService } from 'swipes-core-js/classes/utils';
import SWView from 'SWView';
import Button from 'Button';
import Icon from 'Icon';
import HOCHeaderTitle from 'components/header-title/HOCHeaderTitle';
import HOCAttachButton from 'components/attachments/HOCAttachButton';
import PostComposer from './PostComposer';
import './styles/create-post.scss';

class CreatePost extends PureComponent {
  constructor(props) {
    super(props)
    setupDelegate(this, 'onButtonClick', 'onPostClick', 'onContextClick', 'onChangeFiles', 'onAttachmentClick');
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
  renderHeader() {

    return (
      <HOCHeaderTitle title="Create Post" subtitle={this.renderSubtitle()} border />
    )
  }
  renderComposer() {
    const { delegate, post, myId } = this.props;

    return <PostComposer myId={myId} post={post} delegate={delegate} />
  }
  renderAttachments() {
    const { post } = this.props;
    if(!post.get('attachments').size) {
      return undefined;
    }

    const attachments = post.get('attachments').map((att, i) => (
      <div key={i} className="post-attachment" onClick={this.onAttachmentClickCached(i)}>
        <Icon
          icon={attachmentIconForService(att.getIn(['link', 'service']))}
          className="post-attachment__svg"
        />
        <div className="post-attachment__label">
          {att.get('title')}
        </div>
      </div>
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
    return (
      <SWView
        header={this.renderHeader()}
      >
        {this.renderComposer()}
        {this.renderAttachments()}
        {this.renderActions()}
      </SWView>
    )
  }
}

export default CreatePost

// const { string } = PropTypes;

CreatePost.propTypes = {};
