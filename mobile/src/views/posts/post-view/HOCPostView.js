import React, { PureComponent } from "react";
import { connect } from "react-redux";
import * as a from "actions";
import * as ca from "swipes-core-js/actions";
import getDeep from 'swipes-core-js/utils/getDeep';
import { mobileNavForContext } from 'utils/utils';
import { setupLoading } from 'swipes-core-js/classes/utils';
import PostView from "./PostView";

class HOCPostView extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      commentLoading: false,
    };

    setupLoading(this);
  }
  componentDidMount() {
    this.hideActionBar();
  }
  componentWillUpdate(nextProps) {
    if (nextProps.isActive && !this.props.isActive) {
      this.hideActionBar();
    }
  }
  componentDidUpdate(prevProps) {
    if (!prevProps.isActive && this.props.isActive && this.shouldAutoFocus) {
      this.shouldAutoFocus = false;
      const input = getDeep(this, 'refs.postView.refs.postFooter.refs.input.refs.expandingTextInput');

      if (input && input.focus) {
        input.focus();
      }
    }
  }
  hideActionBar() {
    const { setActionButtons } = this.props;

    setActionButtons({
      hide: true
    });
  }
  onAutoFocus() {
    this.shouldAutoFocus = true
  }
  onOpenUrl(url) {
    const { browser } = this.props;

    browser(url);
  }
  onAttachmentClick(i, item) {
    const { preview } = this.props;

    preview(item.getIn(['attachments', i]));
  }
  onAddReaction(bull, commentId) {
    const { post, addReaction, commentAddReaction } = this.props;
    const runFunc = commentId ? commentAddReaction : addReaction;

    runFunc({
      post_id: post.get("id"),
      reaction: "like",
      comment_id: commentId || null
    }).then(res => {
      if(res.ok) {
        window.analytics.sendEvent('Reaction added', {
          'Where': commentId ? 'Comment' : 'Post',
        });
      }
    });
  }
  onRemoveReaction(bull, commentId) {
    const { post, removeReaction, commentRemoveReaction } = this.props;
    const runFunc = commentId ? commentRemoveReaction : removeReaction;

    runFunc({
      post_id: post.get("id"),
      comment_id: commentId
    }).then(res => {
      if(res.ok) {
        window.analytics.sendEvent('Reaction removed', {
          'Where': commentId ? 'Comment' : 'Post',
        });
      }
    });
  }
  onAddComment(message, attachments) {
    const { addComment, postId } = this.props;

    this.setLoading('commenting');
    addComment({
      post_id: postId,
      message,
      attachments,
    }).then(res => {
      if (res.ok) {
        this.clearLoading('commenting');
        window.analytics.sendEvent('Comment added', {});
      } else {
        this.clearLoading('commenting', '!Someting went wrong');
      }
    });
  }
  onNavigateBack() {
    const { navPop } = this.props;

    navPop();
  }
  onNavigateToContext() {
    const { post, navPush } = this.props;
    const context = post.get('context');

    if (context) {
      navPush(mobileNavForContext(context))
    }
  }
  render() {
    const { myId, post, scrollToBottom } = this.props;

    return <PostView
              ref="postView"
              myId={myId}
              post={post}
              delegate={this}
              {...this.bindLoading()}
              initialScrollToBottom={scrollToBottom}
              navPush={this.props.navPush} 
            />;
  }
}

// const { string } = PropTypes;

HOCPostView.propTypes = {};

function mapStateToProps(state, ownProps) {
  return {
    myId: state.getIn(["me", "id"]),
    post: state.getIn(["posts", ownProps.postId])
  };
}

export default connect(mapStateToProps, {
  browser: a.links.browser,
  preview: a.attachments.preview,
  addComment: ca.posts.addComment,
  addReaction: ca.posts.addReaction,
  commentAddReaction: ca.posts.commentAddReaction,
  commentRemoveReaction: ca.posts.commentRemoveReaction,
  removeReaction: ca.posts.removeReaction
})(HOCPostView);
