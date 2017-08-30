import React, { PureComponent } from 'react'
// import PropTypes from 'prop-types';
// import { map, list } from 'react-immutable-proptypes';
import { setupDelegate } from 'react-delegate';
import { bindAll, setupCachedCallback, typeForId } from 'swipes-core-js/classes/utils';
import SWView from 'SWView';
import HOCHeaderTitle from 'components/header-title/HOCHeaderTitle';
import Button from 'Button';
import TabBar from 'components/tab-bar/TabBar';
import TextParser from 'components/text-parser/TextParser';
// import Icon from 'Icon';
import HOCInfoButton from 'components/info-button/HOCInfoButton';

import HOCPostView from '../post-view/HOCPostView';
import './styles/post-feed.scss';

const DISTANCE = 200;
class PostFeed extends PureComponent {
  constructor(props) {
    super(props);
    setupDelegate(this, 'onPostClick', 'onNewPost', 'onReachedEnd');
    this.onScroll = this.onScroll.bind(this);
    this.state = {
      showLine: false,
    };
    this.lastEnd = 0;
  }
  componentDidMount() {
  }
  onScroll(e) {
    if (e.target.scrollTop > e.target.scrollHeight - e.target.clientHeight - DISTANCE) {
      if (this.lastEnd < e.target.scrollTop + DISTANCE) {
        this.onReachedEnd();
        this.lastEnd = e.target.scrollTop;
      }
    }

  }
  getContextType() {
    const { context } = this.props;
    const contextType = typeForId(context.get('id')).toLowerCase();

    return contextType;
  }
  renderHeader() {
    const { context, delegate, tabs } = this.props;
    let subtitle = context && context.get('title') && `re. ${context.get('title')}`;
    subtitle = subtitle || 'Talk with your team and share the latest and greatest.';

    return (
      <div className="post-feed__header">
        <HOCHeaderTitle title="Discuss" subtitle={subtitle} border={!tabs}>
          <Button primary text="Create a post" onClick={this.onNewPost} />
          <HOCInfoButton delegate={delegate} />
        </HOCHeaderTitle>
        {this.renderTabbar()}
      </div>

    )
  }
  renderTabbar() {
    const { tabs, tabIndex, delegate, posts, relatedPosts } = this.props;
    if (!tabs) {
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
  renderEmptyState() {
    const { tabs } = this.props;

    let text = 'This is a great place to share your thoughts with the team.';
    if (tabs) {
      const contextType = this.getContextType();
      text = `There is no discussions about this ${contextType} yet.\n\nYou can be the first to start one.`;
    }

    return (
      <div className="post-feed__empty-state">
        <div className="post-feed__empty-illustration"></div>
        <div className="post-feed__empty-text"><TextParser>{text}</TextParser></div>
        <Button primary text="Create a post" onClick={this.onNewPost} />
      </div>
    )
  }
  renderPosts() {
    const { posts, delegate, limit, relatedPosts, tabIndex } = this.props;

    if (!posts.size) {
      return this.renderEmptyState()
    }

    const renderPosts = (tabIndex === 1) ? relatedPosts : posts;
    return renderPosts.map((p, i) => {
      if (i >= limit) {
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
