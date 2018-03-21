import React, { PureComponent } from 'react'
import { element } from 'react-swiss';
import { setupDelegate, URL_REGEX } from 'swipes-core-js/classes/utils';
import { List } from 'immutable';
import SWView from 'SWView';
import HOCAttachmentItem from 'components/attachments/HOCAttachmentItem';
import CommentInput from 'components/comment-input/CommentInput';
import CommentView from './CommentView';
import PostAttachment from '../post-components/post-attachment/PostAttachment';
import Button from 'components/button/Button2';
import PostReactions from '../post-components/post-reactions/PostReactions';
import Icon from 'Icon';
import './styles/post-view.scss';
import PostHeader from '../post-components/post-header/PostHeader';

import sw from './PostView.swiss';

const PostMessage = element('div', sw.PostMessage);
const PostActions = element('div', sw.PostActions);
const ActionSpacer = element('div', sw.ActionSpacer);
const PostAttachments = element('div', sw.PostAttachments);

const MAX_COMMENTS_FEED = 3;

class PostView extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {}

    setupDelegate(this, 'onLinkClick', 'onOpenPost', 'onAttachmentClick');
  }
  
  renderAttachments() {
    const { post } = this.props;
    if(!post.get('attachments') || !post.get('attachments').size) {
      return null;
    }
    return (
      <PostAttachments>
        {post.get('attachments').map((att, i) => (
          <PostAttachment attachment={att} key={i} />
        ))}
      </PostAttachments>
    )
  }
  renderHeader() {
    const { post, delegate, fromFeed } = this.props;
    let commentTitle = 'Write a comment';

    return (
      <PostHeader post={post}>
        {this.renderMessage()}
        {this.renderAttachments()}
        <PostActions>
          <PostReactions
            reactions={post.get('reactions')}
            postId={post.get('id')}
          />
          <Button icon="Comment" compact sideLabel={commentTitle} />
          <ActionSpacer />
          <Button icon="ThreeDots" compact />
        </PostActions>
        {this.renderComments()}
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
    /*
    <CommentInput
          myId={myId}
          delegate={delegate}
          aCSearch={aCSearch}
          aCClear={aCClear}
        />
        */
  }

  render() {
    const { delegate, myId, fromFeed, aCSearch, aCClear } = this.props;

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
