import React, { PureComponent } from 'react'
// import PropTypes from 'prop-types';
// import { map, list } from 'react-immutable-proptypes';
import { bindAll, setupDelegate, setupCachedCallback } from 'swipes-core-js/classes/utils';
import SWView from 'SWView';
import HOCHeaderTitle from 'components/header-title/HOCHeaderTitle';
import HOCPostView from '../post-view/HOCPostView';
import Button from 'Button';
// import Icon from 'Icon';
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
    const { filterTitle } = this.props;
    return (
      <HOCHeaderTitle title="Discussions" subtitle={filterTitle && `re. ${filterTitle}`} border>
        <Button primary text="Create Post" onClick={this.onNewPost} />
      </HOCHeaderTitle>
    )
  }
  renderPosts() {
    const { posts, delegate, limit } = this.props;

    return posts.map((pId, i) => {
      if(i >= limit ) {
        return undefined;
      }
      return (
        <div className="post-feed__item" key={pId}>
          <HOCPostView postId={pId} fromFeed />
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
