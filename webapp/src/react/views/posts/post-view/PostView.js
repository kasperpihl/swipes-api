import React, { PureComponent } from 'react'
// import PropTypes from 'prop-types';
// import { map, list } from 'react-immutable-proptypes';
import {
  bindAll,
  setupDelegate,
  setupCachedCallback,
  URL_REGEX,
  attachmentIconForService,
} from 'swipes-core-js/classes/utils';
import { List } from 'immutable';
import SWView from 'SWView';
import HOCAttachmentItem from 'components/attachments/HOCAttachmentItem';
import HOCAssigning from 'components/assigning/HOCAssigning';
import CommentInput from 'components/comment-input/CommentInput';
import PostHeader from 'components/post-header/PostHeader';
import HOCReactions from 'components/reactions/HOCReactions';
import CommentView from './CommentView';
// import Button from 'Button';
import Icon from 'Icon';
import './styles/post-view.scss';

const MAX_COMMENTS_FEED = 3;

class PostView extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {}

    setupDelegate(this, 'onLinkClick', 'onOpenPost', 'onAttachmentClick');
  }
  renderProfilePic() {
    const { post } = this.props;
    const image = msgGen.users.getPhoto(post.get('created_by'));
    const initials = msgGen.users.getInitials(post.get('created_by'));

    if (!image) {
      return (
        <div className="post__profile-initials">
          {initials}
        </div>
      )
    }

    return (
      <div className="post__profile-pic">
        <img src={image} />
      </div>
    )
  }
  renderHeader() {
    const { post, delegate } = this.props;

    return (
      <div className="post__header">
        <div className="post__left">
          {this.renderProfilePic()}
        </div>
        <div className="post__right">
          <PostHeader post={post} delegate={delegate} />
          <div className="post__message-wrapper">
            {this.renderMessage()}
            {this.renderPostActions()}
          </div>
          {this.renderAttachments()}
        </div>
      </div>
    )
  }
  renderFooter() {
    const { delegate, myId } = this.props;

    return <CommentInput myId={myId} delegate={delegate} />
  }
  renderMessage() {
    const { post } = this.props;

    if (post && post.get('message')) {

      let message = post.get('message');

      message = message.split('\n').map((item, key) => {
        const urls = item.match(URL_REGEX);
        if (urls) {
          item = item.split(URL_REGEX);
          urls.forEach((url, i) => {
            item.splice(1 + i + i, 0, (
              <a
                onClick={this.onLinkClickCached(url)}
                className="notification__link"
                key={'link' + i}
              >
                {url}
              </a>
            ));
          })
        }

        return <span key={key}>{item}<br /></span>;
      });


      return (
        <div className="post__message">
          {message}
        </div>
      )
    }

  }
  renderAttachments() {
    const { post } = this.props;

    return (
      <div className="post__attachments">
        {post.get('attachments').map((att, i) => (
          <HOCAttachmentItem attachment={att} key={i} />
        ))}
      </div>
    )
  }
  renderPostActions() {
    const { post } = this.props;

    return (
      <div className="post__actions">
        <HOCReactions
          reactions={post.get('reactions')}
          postId={post.get('id')}
        />
      </div>
    )
  }
  renderViewMoreComments() {
    const { fromFeed, post } = this.props;
    const comments = post.get('comments');

    if (!fromFeed || comments.size <= MAX_COMMENTS_FEED) return undefined;

    const number = comments.size - MAX_COMMENTS_FEED + 1;

    return (
      <div className="post__more-comments" onClick={this.onOpenPostCached(post.get('id'))}>
        View {number} more comments
      </div>
    )
  }
  renderComments() {
    const { post, delegate, myId, fromFeed, aCSearch, aCClear } = this.props;
    const comments = post.get('comments');
    let renderComments = undefined;

    if (comments && comments.size) {
      let sortedComments = comments.toList().sort((a, b) => a.get('created_at').localeCompare(b.get('created_at')));

      if (fromFeed && comments.size > MAX_COMMENTS_FEED) {
        sortedComments = sortedComments.slice(-MAX_COMMENTS_FEED + 1)
      }

      renderComments = sortedComments.map((c, i) => (
        <CommentView
          isLast={i === comments.size - 1}
          comment={c}
          postId={post.get('id')}
          key={c.get('id')}
          delegate={delegate}
        />
      )).toArray();
    }

    let className = 'post__comments';

    if (!fromFeed) {
      className += ' post__comments--single'
    }

    return (
      <div className={className}>
        {this.renderViewMoreComments()}
        {renderComments}
        <CommentInput
          myId={myId}
          delegate={delegate}
          aCSearch={aCSearch}
          aCClear={aCClear}
        />
      </div>
    );
  }
  render() {
    const { fromFeed } = this.props;
    return (
      <SWView
        noframe
        disableScroll={fromFeed}
      >

        {this.renderHeader()}
        {this.renderComments()}
      </SWView>
    )
  }
}

export default PostView
// const { string } = PropTypes;
PostView.propTypes = {};
