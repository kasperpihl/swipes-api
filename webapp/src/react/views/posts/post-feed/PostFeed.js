import React, { PureComponent } from 'react'
// import PropTypes from 'prop-types';
// import { map, list } from 'react-immutable-proptypes';
import { bindAll, setupDelegate, setupCachedCallback } from 'swipes-core-js/classes/utils';
import SWView from 'SWView';
import HOCHeaderTitle from 'components/header-title/HOCHeaderTitle';
import Button from 'Button';
import TabBar from 'components/tab-bar/TabBar';
// import Icon from 'Icon';
import HOCPostView from '../post-view/HOCPostView';
import './styles/post-feed.scss';

const DISTANCE = 200;
class PostFeed extends PureComponent {
  constructor(props) {
    super(props)
    setupDelegate(this, 'onPostClick', 'onNewPost', 'onReachedEnd');
    this.onScroll = this.onScroll.bind(this);
    this.state = {}
    this.lastEnd = 0;
  }
  componentDidMount() {
  }
  onScroll(e) {
    if(e.target.scrollTop > e.target.scrollHeight - e.target.clientHeight - DISTANCE) {
      if(this.lastEnd < e.target.scrollTop + DISTANCE) {
        this.onReachedEnd();
        this.lastEnd = e.target.scrollTop;
      }
    }
  }
  renderHeader() {
    const { context } = this.props;
    const title = context && context.get('title');
    return (
      <div className="post-feed__header">
        <HOCHeaderTitle title="Discussions" subtitle={title && `re. ${title}`} border>
          <Button primary text="Create Post" onClick={this.onNewPost} />
        </HOCHeaderTitle>
        {this.renderTabbar()}
      </div>

    )
  }
  renderTabbar() {
    const { tabs, tabIndex, delegate, posts, relatedPosts } = this.props;
    if(!tabs) {
      return undefined;
    }
    return (
      <TabBar
        delegate={delegate}
        tabs={tabs.map((t, i) => {
          return `${t} (${(i === 0) ? posts.size : relatedPosts.size})`;
        })}
        activeTab={tabIndex}
      />
    )
  }
  renderPosts() {
    const { posts, delegate, limit, relatedPosts, tabIndex } = this.props;

    const renderPosts = (tabIndex === 1) ? relatedPosts : posts;
    return renderPosts.map((p, i) => {
      if(i >= limit ) {
        return undefined;
      }
      return (
        <div className="post-feed__item" key={p.get('id')}>
          <HOCPostView postId={p.get('id')} fromFeed />
        </div>
      )
    }).toArray();
  }
  render() {
    return (
      <SWView
        header={this.renderHeader()}
        onScroll={this.onScroll}
      >
        <div className="post-feed">
          {this.renderPosts()}
        </div>
      </SWView>
    )
  }
}

export default PostFeed

// const { string } = PropTypes;

PostFeed.propTypes = {};
