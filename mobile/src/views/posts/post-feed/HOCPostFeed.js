import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import * as a from '../../../actions';
import * as ca from '../../../../swipes-core-js/actions';
import * as cs from '../../../../swipes-core-js/selectors';
import PostFeed from './PostFeed';

class HOCPostFeed extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      hasLoaded: false
    };
    // setupLoading(this)
  }
  componentWillMount() {
    this.updateTabs(this.props);
  }
  componentDidMount() {
    this.loadingTimeout = setTimeout(() => {
      this.setState({ hasLoaded: true });
    }, 1);
  }
  componentWillReceiveProps(nextProps) {
    this.updateTabs(nextProps);
  }
  componentDidUpdate(prevProps) {
    if (!this.state.hasLoaded) {
      clearTimeout(this.loadingTimeout);

      this.loadingTimeout = setTimeout(() => {
        this.setState({ hasLoaded: true });
      }, 1);
    }
  }
  componentWillUnmount() {
    clearTimeout(this.loadingTimeout);
  }
  updateTabs(props) {
    const { tabs } = this.state;
    let dTabs = tabs;
    if(props.context && !dTabs) {
      dTabs = ['This context'];
    }
    if(props.relatedPosts && props.relatedPosts.size && dTabs.length < 2) {
      dTabs = dTabs.concat('Related');
    }
    if(!props.context && dTabs) {
      dTabs = null;
    }

    if(dTabs !== tabs) {
      this.setState({ tabs: dTabs, tabIndex: 0 });
    }
  }
  onChangeTabs(index) {
    if (index !== this.state.tabIndex) {
      this.setState({ tabIndex: index, hasLoaded: false });
    }
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
    const { navPush, context } = this.props;

    navPush({
      id: 'PostCreate',
      title: 'Create a Post',
      props: {
        context
      }
    })
  }
  onOpenPost(postId, scrollToBottom) {
    const { navPush } = this.props;

    navPush({
      id: 'PostView',
      title: 'Post',
      props: {
        postId,
        scrollToBottom: scrollToBottom
      }
    })
  }
  onAttachmentClick(i, post) {
    const { preview } = this.props;

    preview(post.getIn(['attachments', i]));
  }
  render() {
    const { posts, counter, relatedPosts } = this.props;
    const { tabs, tabIndex } = this.state;

    const sortedPosts = posts.sort((a, b) => {
      return b.get('created_at').localeCompare(a.get('created_at'));
    });

    return (
      <PostFeed
        posts={sortedPosts}
        delegate={this}
        tabIndex={tabIndex}
        tabs={tabs}
        relatedPosts={relatedPosts}
        hasLoaded={this.state.hasLoaded}
      />
    );
  }
}

function makeMapStateToProps() {
  const getFilteredList = cs.posts.makeGetFilteredList();
  const getRelatedList = cs.posts.makeGetRelatedList();
  
  return (state, props) => {
    let counter = getFilteredList(state, props).size;

    if(props.relatedFilter) {
      counter += getRelatedList(state, props).size;
    }

    return {
      posts: getFilteredList(state, props),
      relatedPosts: getRelatedList(state, props),
      counter
    };
  }
}

export default connect(makeMapStateToProps, {
  preview: a.links.preview,
  browser: a.links.browser,
  addReaction: ca.posts.addReaction,
  commentAddReaction: ca.posts.commentAddReaction,
  commentRemoveReaction: ca.posts.commentRemoveReaction,
  removeReaction: ca.posts.removeReaction,
})(HOCPostFeed);
