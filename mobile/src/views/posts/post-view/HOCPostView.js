import React, { PureComponent } from "react";
// import PropTypes from 'prop-types';
import { connect } from "react-redux";
import * as a from "../../../actions";
import * as ca from "../../../../swipes-core-js/actions";
// import { map, list } from 'react-immutable-proptypes';
// import { fromJS } from 'immutable';
import PostView from "./PostView";

class HOCPostView extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {
    this.hideActionBar();
  }
  hideActionBar() {
    const { setActionButtons } = this.props;

    setActionButtons({
      hide: true
    });
  }
  onAddReaction(bull, commentId) {
    const { post, addReaction, commentAddReaction } = this.props;
    const runFunc = commentId ? commentAddReaction : addReaction;

    console.log('====================================');
    console.log('adding a reaction', commentId, runFunc);
    console.log('====================================');

    runFunc({
      post_id: post.get("id"),
      reaction: "like",
      comment_id: commentId || null
    }).then(res => {
      console.log('====================================');
      console.log('res', res);
      console.log('====================================');
    });
  }
  onRemoveReaction(bull, commentId) {
    const { post, removeReaction, commentRemoveReaction } = this.props;
    const runFunc = commentId ? commentRemoveReaction : removeReaction;

    runFunc({
      post_id: post.get("id"),
      comment_id: commentId
    }).then(res => {
    });
  }
  onAddComment(message, e) {
    const { addComment, postId } = this.props;

    addComment({
      post_id: postId,
      message
    }).then(res => {
      if (res.ok) {
      }
    });
  }
  render() {
    const { myId, post } = this.props;

    return <PostView myId={myId} post={post} delegate={this} />;
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
  addComment: ca.posts.addComment,
  addReaction: ca.posts.addReaction,
  commentAddReaction: ca.posts.commentAddReaction,
  commentRemoveReaction: ca.posts.commentRemoveReaction,
  removeReaction: ca.posts.removeReaction
})(HOCPostView);
