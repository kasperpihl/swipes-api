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
    const { navPush, context } = this.props;

    navPush({
      id: 'CreatePost',
      title: 'New post',
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
function mapStateToProps(state, props) {
  const obj = {};
  if(props.context) {
    obj.posts = cs.posts.getContextList(state, props);
    if(props.relatedFilter) {
      obj.relatedPosts = cs.posts.getRelatedList(state, props);
    }
  } else {
    obj.posts = cs.posts.getSorted(state);
  }

  return obj;
}
export default navWrapper(connect(mapStateToProps, {
})(HOCPostFeed));
