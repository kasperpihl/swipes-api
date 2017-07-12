import React, { PureComponent } from 'react';
// import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import * as a from 'actions';
import * as ca from 'swipes-core-js/actions';
import { setupLoading, navForContext } from 'swipes-core-js/classes/utils';
// import { map, list } from 'react-immutable-proptypes';
// import { fromJS } from 'immutable';
import PostView from './PostView';

class HOCPostView extends PureComponent {
  static maxWidth() {
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
  onHeaderContextClick() {
    const { openSecondary, post } = this.props;
    openSecondary(navForContext(post.get('context')));
  }
  onLinkClick(url) {
    const { browser, target } = this.props;

    browser(target, url);
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
    const { myId, post, fromFeed } = this.props;

    return (
      <PostView
        fromFeed
        myId={myId}
        post={post}
        delegate={this}
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

export default connect(mapStateToProps, {
  addComment: ca.posts.addComment,
  browser: a.main.browser,
})(HOCPostView);
