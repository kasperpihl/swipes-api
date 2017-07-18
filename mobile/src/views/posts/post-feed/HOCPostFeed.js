import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import * as a from '../../../actions';
import * as ca from '../../../../swipes-core-js/actions';
import PostFeed from './PostFeed';

class HOCPostFeed extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
    // setupLoading(this)
  }
  componentDidMount() {
  }
  onAddReaction(post, commentId) {
    const { addReaction, commentAddReaction } = this.props;
    const runFunc = commentId ? commentAddReaction : addReaction;

    runFunc({
      post_id: post.get('id'),
      reaction: 'like',
      comment_id: commentId || null,
    }).then((res) => {

    });
  }
  onRemoveReaction(post, commentId) {
    const { removeReaction, commentRemoveReaction } = this.props;
    const runFunc = commentId ? commentRemoveReaction : removeReaction;

    runFunc({
      post_id: post.get('id'),
      comment_id: commentId,
    }).then((res) => {

    });
  }
  onOpenUrl(url) {
    const { browser } = this.props;

    browser(url);
  }
  onNewPost() {
    // const { navPush } = this.props;

    // navPush({
    //   id: 'CreatePost',
    //   title: 'New post',
    // })
  }
  onOpenPost(postId) {
    const { navPush } = this.props;

    navPush({
      id: 'PostView',
      title: 'Post',
      props: {
        postId,
      }
    })
  }
  render() {
    const { posts } = this.props;

    const sortedPosts = posts.sort((a, b) => {
      return b.get('created_at').localeCompare(a.get('created_at'));
    });

    return (
      <PostFeed
        posts={sortedPosts}
        delegate={this}
      />
    );
  }
}

function mapStateToProps(state) {
  return {
    posts: state.get('posts'),
  };
}

export default connect(mapStateToProps, {
  browser: a.links.browser,
  addReaction: ca.posts.addReaction,
  commentAddReaction: ca.posts.commentAddReaction,
  commentRemoveReaction: ca.posts.commentRemoveReaction,
  removeReaction: ca.posts.removeReaction,
})(HOCPostFeed);