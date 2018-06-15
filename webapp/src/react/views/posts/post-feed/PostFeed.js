import React, { PureComponent } from 'react'
import { setupDelegate } from 'react-delegate';
import { bindAll, setupCachedCallback, typeForId, miniIconForId } from 'swipes-core-js/classes/utils';
import EmptyState from '../../../components/empty-state/EmptyState';
import SWView from 'SWView';
import HOCHeaderTitle from 'src/react/components/header-title/HOCHeaderTitle';
import Button from 'src/react/components/button/Button';
import TabBar from 'src/react/components/tab-bar/TabBar';
import TextParser from 'src/react/components/text-parser/TextParser';
import InfoButton from 'src/react/components/info-button/InfoButton';
import SW from './PostFeed.swiss';
import HOCPostView from '../post-view/HOCPostView';

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
  renderSubtitleWithContext(title) {
    const { context } = this.props;

    if (context && context.get('title') && context.get('id')) {
      const icon = miniIconForId(context.get('id'));

      return (
        <SW.SubtitleWrapper>
          <SW.SubtitleIcon icon={icon} />
          <div className="header-title__subtitle">{context.get('title')}</div>
        </SW.SubtitleWrapper>
      )
    }


    return undefined;

  }
  renderHeader() {
    const { context, delegate, tabs } = this.props;
    let subtitle = context && context.get('title') && this.renderSubtitleWithContext();
    subtitle = subtitle || 'Talk with your team and share the latest and greatest.';

    return (
      <div>
        <HOCHeaderTitle title="Discuss" subtitle={subtitle} border={!tabs}>
          <InfoButton delegate={delegate} />
        </HOCHeaderTitle>
        {this.renderTabbar()}
      </div>

    )
  }
  renderFooter() {
    return (
      <SW.Footer>
        <Button icon="Plus" onClick={this.onNewPost} sideLabel="Create new post" />
      </SW.Footer>
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

    if (tabs) {
      const contextType = this.getContextType();
      text = ``;
    }

    return (
      <EmptyState
        icon="ESMilestoneAchieved"
        title="Start a discussion"
        description={`There are no discussions about this ${contextType} yet.\nYou can be the first to start one.`}
      >
        <Button onClick={this.onNewPost} title="Create a post" />
      </EmptyState>
    )
  }
  renderPosts() {
    const { posts, delegate, limit, relatedPosts, tabIndex } = this.props;

    const renderPosts = (tabIndex === 1) ? relatedPosts : posts;
    if (!renderPosts.size) {
      return this.renderEmptyState()
    }
    return renderPosts.map((p, i) => {
      if (i >= limit) {
        return undefined;
      }
      return (
        <SW.PostItem key={p.get('id')}>
          <HOCPostView postId={p.get('id')} fromFeed />
        </SW.PostItem>
      )
    }).toArray();
  }
  render() {
    const { posts } = this.props;

    return (
      <SWView
        header={this.renderHeader()}
        footer={this.renderFooter()}
        onScroll={this.onScroll}
      >
        <SW.Container empty={!posts.size}>
          {this.renderPosts()}
        </SW.Container>
      </SWView>
    )
  }
}

export default PostFeed;
