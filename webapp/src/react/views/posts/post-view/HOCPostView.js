import React, { PureComponent } from 'react';
// import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import * as a from 'actions';
import * as ca from 'swipes-core-js/actions';
import { setupLoading, navForContext } from 'swipes-core-js/classes/utils';
// import { map, list } from 'react-immutable-proptypes';
import navWrapper from 'src/react/app/view-controller/NavWrapper';
// import { fromJS } from 'immutable';
import PostView from './PostView';

class HOCPostView extends PureComponent {
  static maxWidth() {
    return 600;
  }
  static minWidth() {
    return 600;
  }
  constructor(props) {
    super(props);
    this.state = {};

    setupLoading(this)
  }
  componentDidMount() {
  }
  shouldScroll() {
    const { fromFeed } = this.props;

    return !fromFeed;
  }
  onAttachmentClick(i) {
    const { preview, target, post } = this.props;

    preview(target, post.getIn(['attachments', i]));
  }
  onAddReaction(commentId) {
    const { post, addReaction, commentAddReaction } = this.props;
    const runFunc = commentId ? commentAddReaction : addReaction;

    this.setLoading(`${commentId || ''}reaction`);
    runFunc({
      post_id: post.get('id'),
      reaction: 'like',
      comment_id: commentId || null,
    }).then((res) => {
      this.clearLoading(`${commentId || ''}reaction`)
    });
  }
  onRemoveReaction(commentId) {
    const { post, removeReaction, commentRemoveReaction } = this.props;
    const runFunc = commentId ? commentRemoveReaction : removeReaction;

    this.setLoading(`${commentId || ''}reaction`);
    runFunc({
      post_id: post.get('id'),
      comment_id: commentId,
    }).then((res) => {
      this.clearLoading(`${commentId || ''}reaction`)
    });
  }
  onHeaderContextClick() {
    const { openSecondary, post, target } = this.props;
    openSecondary(target, navForContext(post.get('context')));
  }
  onLinkClick(url) {
    const { browser, target } = this.props;
    browser(target, url);
  }
  onOpenPost(postId) {
    const { openSecondary, post, target } = this.props;
    openSecondary(target, navForContext(postId));
  }
  onAddComment(message, e) {
    const { addComment, postId } = this.props;

    addComment({
      post_id: postId,
      message,
    }).then((res) => {
      if (res.ok) {

      }
    })
  }
  render() {
    const { myId, post, fromFeed, aCSearch, aCClear } = this.props;

    return (
      <PostView
        fromFeed={fromFeed}
        aCSearch={aCSearch}
        aCClear={aCClear}
        myId={myId}
        post={post}
        delegate={this}
        {...this.bindLoading() }
      />
    );
  }
}

// const { string } = PropTypes;

HOCPostView.propTypes = {};

function mapStateToProps(state, ownProps) {
  return {
    myId: state.getIn(['me', 'id']),
    post: state.getIn(['posts', ownProps.postId])
  };
}

export default navWrapper(connect(mapStateToProps, {
  openSecondary: a.navigation.openSecondary,
  aCSearch: ca.autoComplete.search,
  aCClear: ca.autoComplete.clear,
  addComment: ca.posts.addComment,
  addReaction: ca.posts.addReaction,
  commentAddReaction: ca.posts.commentAddReaction,
  commentRemoveReaction: ca.posts.commentRemoveReaction,
  removeReaction: ca.posts.removeReaction,
  preview: a.links.preview,
  browser: a.main.browser,
})(HOCPostView));
