import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import * as a from 'actions';
import Fuse from 'fuse.js';
import * as ca from 'swipes-core-js/actions';
import * as cs from 'swipes-core-js/selectors';
import { setupLoading, navForContext } from 'swipes-core-js/classes/utils';
import navWrapper from 'src/react/app/view-controller/NavWrapper';
import PostView from './PostView';

const options = {
  shouldSort: true,
  includeScore: true,
  includeMatches: true,
  // location: 0,
  // id: 'id',
  threshold: 0.5,
  // distance: 1000,
  maxPatternLength: 32,
  minMatchCharLength: 2,
  keys: [
    'email',
    'profile.first_name',
    'profile.last_name',
  ],
};

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
  shouldScroll() {
    const { fromFeed } = this.props;

    return !fromFeed;
  }
  onAttachmentClick(i, att) {
    const { preview, target } = this.props;

    preview(target, att);
  }
  onContextClick() {
    const { openSecondary, post, target } = this.props;
    openSecondary(target, navForContext(post.get('context')));
  }
  onSearch(text, callback) {
    if(!text) callback([]);
    let fuse = new Fuse(this.props.users, options);
    callback(fuse.search(text).map((res) => ({
      id: res.item.id,
      display: msgGen.users.getFirstName(res.item.id),
    })));
  }
  onLinkClick(url) {
    const { browser, target } = this.props;
    browser(target, url);
  }
  onOpenPost() {
    const { openSecondary, post, target, fromFeed } = this.props;
    if(fromFeed) {
      openSecondary(target, navForContext(post.get('id')));
    }
  }
  onAddComment(message, attachments, e) {
    const { addComment, postId } = this.props;

    addComment({
      post_id: postId,
      attachments,
      message,
    }).then((res) => {
      if (res.ok) {
        window.analytics.sendEvent('Comment added', {});
      }
    })
  }
  render() {
    const { myId, post, fromFeed } = this.props;

    return (
      <PostView
        fromFeed={fromFeed}
        myId={myId}
        post={post}
        delegate={this}
        {...this.bindLoading() }
      />
    );
  }
}


export default navWrapper(connect((state, ownProps) => ({
  myId: state.getIn(['me', 'id']),
  post: state.getIn(['posts', ownProps.postId]),
  users: cs.users.getActiveArray(state),
}), {
  openSecondary: a.navigation.openSecondary,
  addComment: ca.posts.addComment,
  addReaction: ca.posts.addReaction,
  commentAddReaction: ca.posts.commentAddReaction,
  commentRemoveReaction: ca.posts.commentRemoveReaction,
  removeReaction: ca.posts.removeReaction,
  preview: a.links.preview,
  browser: a.main.browser,
})(HOCPostView));
