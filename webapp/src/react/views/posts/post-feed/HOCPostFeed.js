import React, { PureComponent } from 'react';
// import PropTypes from 'prop-types';
import { connect } from 'react-redux';
// import * as a from 'actions';
// import * as ca from 'swipes-core-js/actions';
// import { setupLoading } from 'swipes-core-js/classes/utils';
// import { map, list } from 'react-immutable-proptypes';
// import { fromJS } from 'immutable';
import PostFeed from './PostFeed';

class HOCPostFeed extends PureComponent {
  static maxWidth() {
    return 600;
  }
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {
  }
  onNewPost() {
    const { navPush } = this.props;

    navPush({
      id: 'CreatePost',
      title: 'New post',
    })
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
      return a.get('updated_at').localeCompare(b.get('updated_at'));
    });

    return (
      <PostFeed
        posts={sortedPosts}
        delegate={this}
      />
    );
  }
}

// const { string } = PropTypes;
HOCPostFeed.propTypes = {};
function mapStateToProps(state) {
  return {
    posts: state.get('posts'),
  };
}
export default connect(mapStateToProps, {
})(HOCPostFeed);
