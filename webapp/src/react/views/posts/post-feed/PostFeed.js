import React, { PureComponent } from 'react'
import { styleElement} from 'swiss-react';
import { setupDelegate } from 'react-delegate';
import { bindAll, setupCachedCallback, typeForId, miniIconForId } from 'swipes-core-js/classes/utils';
import SWView from 'SWView';
import HOCHeaderTitle from 'src/react/components/header-title/HOCHeaderTitle';
import Button from 'src/react/components/button/Button';
import TabBar from 'src/react/components/tab-bar/TabBar';
import TextParser from 'src/react/components/text-parser/TextParser';
import Icon from 'Icon';
import InfoButton from 'src/react/components/info-button/InfoButton';
import styles from './PostFeed.swiss';
import HOCPostView from '../post-view/HOCPostView';

const Container = styleElement('div', styles.Container);
const PostItem = styleElement('div', styles.PostItem);
const SubtitleWrapper = styleElement('div', styles.SubtitleWrapper);
const SubtitleIcon = styleElement(Icon, styles.SubtitleIcon);
const EmptyState = styleElement('div', styles.EmptyState);
const EmptyIllustration = styleElement('div', styles.EmptyIllustration);
const EmptySvg = styleElement(Icon, styles.EmptySvg);
const EmptyTitle = styleElement('div', styles.EmptyTitle);
const EmptyText = styleElement('div', styles.EmptyText);
const Footer = styleElement('div', styles.Footer);
const Div = styleElement('div');

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
        <SubtitleWrapper>
          <SubtitleIcon icon={icon} />
          <div className="header-title__subtitle">{context.get('title')}</div>
        </SubtitleWrapper>
      )
    }


    return undefined;
    
  }
  renderHeader() {
    const { context, delegate, tabs } = this.props;
    let subtitle = context && context.get('title') && this.renderSubtitleWithContext();
    subtitle = subtitle || 'Talk with your team and share the latest and greatest.';

    return (
      <Div>
        <HOCHeaderTitle title="Discuss" subtitle={subtitle} border={!tabs}>
          <InfoButton delegate={delegate} />
        </HOCHeaderTitle>
        {this.renderTabbar()}
      </Div>

    )
  }
  renderFooter() {
    return (
      <Footer>
        <Button icon="Plus" onClick={this.onNewPost} sideLabel="Create new post" />
      </Footer>
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

    let text = 'This is a great place to share ideas and keep each\nother up to date';
    if (tabs) {
      const contextType = this.getContextType();
      text = `There are no discussions about this ${contextType} yet.\nYou can be the first to start one.`;
    }

    return (
      <EmptyState>
        <EmptyIllustration>
          <EmptySvg icon="ESMilestoneAchieved" />
        </EmptyIllustration>
        <EmptyTitle>
          start a discussion
        </EmptyTitle>
        <EmptyText><TextParser>{text}</TextParser></EmptyText>
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
        <PostItem key={p.get('id')}>
          <HOCPostView postId={p.get('id')} fromFeed />
        </PostItem>
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
        <Container empty={!posts.size}>
          {this.renderPosts()}
        </Container>
      </SWView>
    )
  }
}

export default PostFeed;
