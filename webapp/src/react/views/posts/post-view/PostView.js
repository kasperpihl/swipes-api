import React, { PureComponent } from 'react'
import { styleElement } from 'swiss-react';
import { URL_REGEX, attachmentIconForService, miniIconForId } from 'swipes-core-js/classes/utils';
import { setupDelegate } from 'react-delegate';
import { List } from 'immutable';
import SWView from 'SWView';
import PostCommentInput from '../post-components/post-comment-input/PostCommentInput';
import CommentView from './CommentView';
import PostAttachment from '../post-components/post-attachment/PostAttachment';
import Button from 'src/react/components/button/Button';
import PostReactions from '../post-components/post-reactions/PostReactions';
import Icon from 'Icon';
import PostHeader from '../post-components/post-header/PostHeader';
import styles from './PostView.swiss';

const Message = styleElement('div', styles.Message);
const Link = styleElement('a', styles.Link);
const Actions = styleElement('div', styles.Actions);
const ActionSpacer = styleElement('div', styles.ActionSpacer);
const Attachments = styleElement('div', styles.Attachments);

const MAX_COMMENTS_FEED = 3;

class PostView extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {};

    setupDelegate(this, 'onLinkClick', 'onOpenPost', 'onAttachmentClick', 'onContextClick', 'onThreeDots');
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
    const { post, delegate, fromFeed, getLoading } = this.props;
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
          <Attachments>
            {post.get('context') && this.renderContext()}
            {this.renderAttachments()}
          </Attachments>
        )}
        <Actions>
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
          <Button
            icon="ThreeDots"
            compact
            onClick={this.onThreeDots}
            {...getLoading('threedots')}
          />
        </Actions>
        {this.renderComments()}
        {this.renderCommentInput()}
      </PostHeader>
    )
  }
  renderStuff(regex, inputArray, renderMethod) {
    let resArray = [];
    if(typeof inputArray === 'string') {
      inputArray = [inputArray];
    }
    inputArray.forEach((string) => {
      if(typeof string !== 'string'){
        return resArray.push(string);
      }
      const matches = string.match(regex);
      if(matches) {
        let innerSplits = string.split(regex);
        matches.forEach((match, i) => {
          innerSplits.splice(1 + i + i, 0, renderMethod.call(null, match, i));
        });
        resArray = resArray.concat(innerSplits);
      } else {
        resArray.push(string);
      }
    });
    return resArray;
  }
  renderMessage() {
    const { post } = this.props;

    if (post && post.get('message')) {

      let message = post.get('message');

      message = message.split('\n').map((item, key) => {
        item = this.renderStuff(URL_REGEX, item, (url, i) => (
          <Link
            onClick={this.onLinkClickCached(url)}
            className="notification__link"
            key={`link${i}`}
          >
            {url}
          </Link>
        ));

        item = this.renderStuff(/<![A-Z0-9]*\|.*?>/gi, item, (mention, i) => {
          const index = mention.indexOf('|');
          const id = mention.substring(2, index - 1);
          const name = mention.substr(index + 1, mention.length - index - 2);
          return <b key={`mention${i}`}>{name}</b>;
        });

        return <span key={key}>{item}<br /></span>;
      });


      return (
        <Message>
          {message}
        </Message>
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
    const { post, fromFeed, delegate } = this.props;

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
        noframe={fromFeed}
        disableScroll={fromFeed}
        scrollToBottom={!fromFeed}
      >
        {this.renderHeader()}
      </SWView>
    )
  }
}

export default PostView
