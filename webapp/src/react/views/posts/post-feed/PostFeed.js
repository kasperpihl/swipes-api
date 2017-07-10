import React, { PureComponent } from 'react'
// import PropTypes from 'prop-types';
// import { map, list } from 'react-immutable-proptypes';
import { bindAll, setupDelegate, setupCachedCallback } from 'swipes-core-js/classes/utils';
import SWView from 'SWView';
import HOCHeaderTitle from 'components/header-title/HOCHeaderTitle';
import Button from 'Button';
// import Icon from 'Icon';
// import './styles/post-feed.scss';

class PostFeed extends PureComponent {
  constructor(props) {
    super(props)
    setupDelegate(this);
    this.callDelegate.bindAll('onPostClick', 'onNewPost');
    this.state = {}
  }
  componentDidMount() {
  }
  renderHeader() {

    return (
      <HOCHeaderTitle>
        <Button text="Create Post" onClick={this.onNewPost} />
      </HOCHeaderTitle>
    )
  }
  renderPosts() {
    const { posts } = this.props;

    return posts.map((p) => (
      <div
        key={p.get('id')}
        onClick={this.onPostClickCached(p.get('id'))}
      >
          {p.get('message')}
      </div>
    )).toArray();
  }
  render() {
    return (
      <SWView
        header={this.renderHeader()}
      >
        {this.renderPosts()}
      </SWView>
    )
  }
}

export default PostFeed

// const { string } = PropTypes;

PostFeed.propTypes = {};
