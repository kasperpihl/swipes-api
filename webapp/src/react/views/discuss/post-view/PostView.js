import React, { PureComponent } from 'react'
import { styleElement } from 'react-swiss';
import { setupDelegate, URL_REGEX, attachmentIconForService, miniIconForId } from 'swipes-core-js/classes/utils';
import { List } from 'immutable';
import SWView from 'SWView';
import HOCAttachmentItem from 'components/attachments/HOCAttachmentItem';
import PostCommentInput from '../post-components/post-comment-input/PostCommentInput';
import CommentView from './CommentView';
import PostAttachment from '../post-components/post-attachment/PostAttachment';
import Button from 'components/button/Button2';
import PostReactions from '../post-components/post-reactions/PostReactions';
import Icon from 'Icon';
import './styles/post-view.scss';
import PostHeader from '../post-components/post-header/PostHeader';
import styles from './PostView.swiss';

const PostMessage = styleElement('div', styles.PostMessage);
const PostActions = styleElement('div', styles.PostActions);
const ActionSpacer = styleElement('div', styles.ActionSpacer);
const PostAttachments = styleElement('div', styles.PostAttachments);

const MAX_COMMENTS_FEED = 3;

class PostView extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {};

    setupDelegate(this, 'onLinkClick', 'onOpenPost', 'onAttachmentClick', 'onContextClick');
  }
  onComment = () => {
    const { post } = this.props;
    if(!post.get('comments').size) {
      this.setState({ forceInput: true });
    } else {
      this.onOpenPost();
    }
  }
  renderContext() {
    const { post } = this.props;
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
    const { post } = this.props;

    return post.get('attachments').map((att, i) => {
      const icon = attachmentIconForService(att.getIn(['link', 'service']));
      return (
        <PostAttachment
          title={att.get('title')}
          key={i}
          onClick={this.onAttachmentClickCached(i, att)}
          icon={icon}
        />
      )
    });
  }
  renderHeader() {
    const { post, delegate, fromFeed } = this.props;
    let commentTitle = post.get('comments').size || 'Write a comment';
    if(post.get('comments').size > MAX_COMMENTS_FEED) {
      commentTitle = `See all ${post.get('comments').size} comments`;
    }

    return (
      <PostHeader
        onSubtitleClick={fromFeed && this.onOpenPost}
        post={post}>
        {this.renderMessage()}
        {(!!post.get('context') || !!post.get('attachments').size) && (
          <PostAttachments>
            {post.get('context') && this.renderContext()}
            {this.renderAttachments()}
          </PostAttachments>
        )}
        <PostActions>
          <PostReactions
            reactions={post.get('reactions')}
            postId={post.get('id')}
          />
          <Button
            icon="Comment"
            compact
            onClick={this.onComment}
            sideLabel={commentTitle}
          />
          <ActionSpacer />
          <Button icon="ThreeDots" compact />
        </PostActions>
        {this.renderComments()}
        {this.renderCommentInput()}
      </PostHeader>
    )
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
        <PostMessage>
          {message}
        </PostMessage>
      )
    }

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
  renderCommentInput() {
    const { delegate, myId, post } = this.props;
    const { forceInput } = this.state;

    if(post.get('comments').size || forceInput) {

      return (
        <PostCommentInput
          myId={myId}
          postId={post.get('id')}
          autoFocus={forceInput}
          delegate={delegate}
        />
      )
    }
  }
  renderComments() {
    const { post, fromFeed } = this.props;

    if(!post.get('comments') || !post.get('comments').size) {
      return null;
    }
    const comments = post.get('comments');
    let renderComments = undefined;

    let sortedComments = comments.toList().sort((a, b) => a.get('created_at').localeCompare(b.get('created_at')));

    if (fromFeed && comments.size > MAX_COMMENTS_FEED) {
      sortedComments = sortedComments.slice(-MAX_COMMENTS_FEED + 1)
    }

    return sortedComments.map((c, i) => (
      <CommentView
        isLast={i === comments.size - 1}
        comment={c}
        postId={post.get('id')}
        key={c.get('id')}
        delegate={delegate}
      />
    )).toArray();
  }

  render() {
    const { delegate, myId, fromFeed } = this.props;

    return (
      <SWView
        noframe
        disableScroll={fromFeed}
        scrollToBottom={!fromFeed}
      >
        {this.renderHeader()}
      </SWView>
    )
  }
}

export default PostView
