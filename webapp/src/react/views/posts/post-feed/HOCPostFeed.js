import React, { PureComponent } from 'react';
// import PropTypes from 'prop-types';
import { connect } from 'react-redux';
// import * as a from 'actions';
// import * as ca from 'swipes-core-js/actions';
import * as cs from 'swipes-core-js/selectors';
// import { setupLoading } from 'swipes-core-js/classes/utils';
// import { map, list } from 'react-immutable-proptypes';
// import { fromJS } from 'immutable';
import navWrapper from 'src/react/app/view-controller/NavWrapper';
import PostFeed from './PostFeed';

class HOCPostFeed extends PureComponent {
  static maxWidth() {
    return 600;
  }
  static minWidth() {
    return 540;
  }
  constructor(props) {
    super(props);
    this.state = { limit: 10 };
  }
  componentDidMount() {
  }
  onReachedEnd() {
    this.setState({ limit: this.state.limit + 10 });
  }
  onNewPost() {
    const { navPush, filterId, filterTitle } = this.props;
    let context = null;
    if(filterId) {
      context = {
        id: filterId,
        title: filterTitle
      };
    }
    navPush({
      id: 'CreatePost',
      title: 'New post',
      props: {
        context,
      },
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
    const { posts, filterTitle } = this.props;
    const { limit } = this.state;

    return (
      <PostFeed
        posts={posts}
        limit={limit}
        filterTitle={filterTitle}
        delegate={this}
      />
    );
  }
}

// const { string } = PropTypes;
HOCPostFeed.propTypes = {};
function mapStateToProps(state, ownProps) {
  return {
    posts: cs.posts.getSortedIds(state, ownProps),
  };
}
export default navWrapper(connect(mapStateToProps, {
})(HOCPostFeed));
