import React, { PureComponent } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import ImmutableVirtualizedList from 'react-native-immutable-list-view';
import { setupDelegate } from '../../../../swipes-core-js/classes/utils';
import { colors, viewSize } from '../../../utils/globalStyles';
import RippleButton from '../../../components/ripple-button/RippleButton';
import EmptyListFooter from '../../../components/empty-list-footer/EmptyListFooter';
import Icon from '../../../components/icons/Icon';
import HOCHeader from '../../../components/header/HOCHeader';
import PostFeedItem from './PostFeedItem';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgColor,
  },
  list: {
    flex: 1,
  },
  loaderContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

class PostFeed extends PureComponent {
  constructor(props) {
    super(props);
    this.state = { };

    setupDelegate(this, 'onNewPost', 'onChangeTabs');

    this.renderFeedItem = this.renderFeedItem.bind(this);
    this.onHeaderTap = this.onHeaderTap.bind(this);
  }
  onHeaderTap() {
    this.refs.scrollView.scrollTo({x: 0, y: 0, animated: true})
  }
  onChangeTab(index) {
    this.onChangeTabs(index);
  }
  renderHeader() {
    const { tabIndex, tabs } = this.props;
    let tabObj = {};

    if (tabs) {
      tabObj = {
        tabs: tabs,
        currentTab: tabIndex
      }
    }

    return (
      <HOCHeader
        title="Discuss"
        delegate={this}
        {...tabObj}
      >
        <RippleButton onPress={this.onNewPost}>
          <View style={{ width: 44, height: 44, alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="Plus" width="24" height="24" fill={colors.deepBlue80} />
          </View>
        </RippleButton>
      </HOCHeader>
    );
  }
  renderFeedItem(post) {
    const { delegate } = this.props;

    return <PostFeedItem post={post} delegate={delegate} />
  }
  renderListLoader() {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator color={colors.blue100} size="large" style={styles.loader} />
      </View>
    );
  }
  renderFooter() {
    return <EmptyListFooter />;
  }
  renderEmptyState() {

    return (
      <View style={{flex: 1, alignItems: 'center', flexDirection: 'column' }}>
        <Icon name="ESDiscussion" width="290" height="300"  />
        <Text style={{ fontSize: 15, lineHeight: 21, color: colors.deepBlue50, paddingTop: 24, textAlign: 'center'  }}>Start a discussion or share an idea</Text>
      </View>
    )
  }
  renderList() {
    const { posts, relatedPosts, tabIndex, hasLoaded } = this.props;

    if (!hasLoaded) {
      return this.renderListLoader();
    }
    
    if (!posts.size) {
      return this.renderEmptyState()
    }

    const renderPosts = (tabIndex === 1) ? relatedPosts : posts;

    return (
      <ImmutableVirtualizedList
        ref="scrollView"
        style={styles.list}
        immutableData={renderPosts}
        renderRow={this.renderFeedItem}
        renderFooter={this.renderFooter}
        onScroll={window.onScroll}
      />
    )
  }
  render() {
    return (
      <View style={styles.container}>
        {this.renderHeader()}
        <View style={styles.list}>
          {this.renderList()}
        </View>
      </View>
    );
  }
}

export default PostFeed;
