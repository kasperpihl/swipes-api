import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import * as a from 'actions';
import { navForContext } from 'swipes-core-js/classes/utils';
import navWrapper from 'src/react/app/view-controller/NavWrapper';
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
  render() {
    const { myId, post, fromFeed } = this.props;

    return (
      <PostView
        fromFeed={fromFeed}
        myId={myId}
        post={post}
        delegate={this}
      />
    );
  }
}


export default navWrapper(connect((state, ownProps) => ({
  myId: state.getIn(['me', 'id']),
  post: state.getIn(['posts', ownProps.postId]),
}), {
  openSecondary: a.navigation.openSecondary,
  preview: a.links.preview,
  browser: a.main.browser,
})(HOCPostView));
