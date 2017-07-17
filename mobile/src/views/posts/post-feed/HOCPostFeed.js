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
  onAddReaction(postId, iLike) {
    const { addReaction, removeReaction } = this.props;
    console.log('====================================');
    console.log('iLike', iLike);
    console.log('====================================');

    if (iLike) {
      removeReaction({
        post_id: postId,
        comment_id: null,
      })
    } else {
      console.log('====================================');
      console.log('what, not here');
      console.log('====================================');
      addReaction({
        post_id: postId,
        reaction: 'like',
        comment_id: null,
      });
    }
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
  onPostClick(postId) {
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
  removeReaction: ca.posts.removeReaction,
})(HOCPostFeed);