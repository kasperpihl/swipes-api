import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import * as cs from 'swipes-core-js/selectors';
import navWrapper from 'src/react/app/view-controller/NavWrapper';
import HOCPostCreate from 'src/react/views/discuss/post-create/HOCPostCreate';
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
    this.state = { limit: 10, tabs: null, tabIndex: 0 };
  }
  componentWillMount() {
    this.updateTabs(this.props);
  }
  componentWillReceiveProps(nextProps) {
    this.updateTabs(nextProps);
  }
  onReachedEnd() {
    this.setState({ limit: this.state.limit + 10 });
  }
  onNewPost() {
    const { openModal, context } = this.props;

    openModal({
      component: HOCPostCreate,
      title: 'New post',
      position: 'bottom',
      props: {
        context: context || null,
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
  getInfoTabProps() {
    return {
      about: {
        title: 'What is Discuss',
        text: 'Discuss is one of the 3 main sections of the Workspace: Plan, Take Action and Discuss.\n\nUnder Discuss you can communicate with your team. You can read the latest updates from your company, take part in discussions or share news with the rest of the team.'
      },
    }
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
  tabDidChange(index) {
    const { tabIndex } = this.state;
    if (tabIndex !== index) {
      this.setState({
        tabIndex: index,
      });
    }
  }
  render() {
    const { posts, context, relatedPosts } = this.props;
    const { limit, tabs, tabIndex } = this.state;

    return (
      <PostFeed
        posts={posts}
        tabIndex={tabIndex}
        tabs={tabs}
        relatedPosts={relatedPosts}
        limit={limit}
        context={context}
        delegate={this}
      />
    );
  }
}

// const { string } = PropTypes;
HOCPostFeed.propTypes = {};
const makeMapStateToProps = () => {
  const getFilteredList = cs.posts.makeGetFilteredList();
  const getRelatedList = cs.posts.makeGetRelatedList();
  return (state, props) => ({
    posts: getFilteredList(state, props),
    relatedPosts: getRelatedList(state, props),
  });
}

export default navWrapper(connect(makeMapStateToProps, {
})(HOCPostFeed));
