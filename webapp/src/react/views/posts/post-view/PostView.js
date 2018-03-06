import React, { PureComponent } from 'react'
import { element } from 'react-swiss';
import { setupDelegate, URL_REGEX } from 'swipes-core-js/classes/utils';
import { List } from 'immutable';
import SWView from 'SWView';
import HOCAttachmentItem from 'components/attachments/HOCAttachmentItem';
import CommentInput from 'components/comment-input/CommentInput';
import CommentView from './CommentView';
import PostAttachment from './PostAttachment';
import Button from 'components/button/Button2';
import PostReactions from './PostReactions';
import Icon from 'Icon';
import './styles/post-view.scss';
import PostHeader from './PostHeader';

import sw from './PostView.swiss';

const PostMessage = element('div', sw.PostMessage);
const PostActions = element('div', sw.PostActions);
const PostAttachments = element('div', sw.PostAttachments);

const MAX_COMMENTS_FEED = 3;

class PostView extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {}

    setupDelegate(this, 'onLinkClick', 'onOpenPost', 'onAttachmentClick');
  }
  renderHeader() {
    const { post, delegate, fromFeed } = this.props;
    let commentTitle = 'Write a comment';

    return (
      <PostHeader post={post}>
        {this.renderMessage()}
        <PostAttachments>
          {post.get('attachments').map((att, i) => (
            <PostAttachment attachment={att} key={i} />
          ))}
        </PostAttachments>
        <PostActions>
          <PostReactions
            reactions={post.get('reactions')}
            postId={post.get('id')}
          />
          <Button icon="Comment" compact>{commentTitle}</Button>
        </PostActions>
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
        scrollToBottom={!fromFeed}
      >
        {this.renderHeader()}
        {this.renderComments()}
      </SWView>
    )
  }
}

export default PostView
