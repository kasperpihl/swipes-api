import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import * as mainActions from 'src/redux/main/mainActions';
import * as linkActions from 'src/redux/link/linkActions';
import * as navigationActions from 'src/redux/navigation/navigationActions';
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


export default navWrapper(connect((state, props) => ({
  myId: state.getIn(['me', 'id']),
  post: state.getIn(['posts', props.postId]),
}), {
  openSecondary: navigationActions.openSecondary,
  preview: linkActions.preview,
  browser: mainActions.browser,
})(HOCPostView));
