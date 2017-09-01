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
  fabWrapper: {
    width: 60,
    height: 60,
    borderRadius: 60 / 2,
    position: 'absolute',
    bottom: 30,
    right: 15,
  },
  fabButton: {
    width: 60,
    height: 60,
    borderRadius: 60 / 2,
    backgroundColor: colors.blue100,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

class PostFeed extends PureComponent {
  constructor(props) {
    super(props);
    this.state = { hasLoaded: false, };

    setupDelegate(this, 'onNewPost');

    this.renderFeedItem = this.renderFeedItem.bind(this);
    this.onHeaderTap = this.onHeaderTap.bind(this);
  }
  componentDidMount() {
    this.loadingTimeout = setTimeout(() => {
      this.setState({ hasLoaded: true });
    }, 1);
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
  onHeaderTap() {
    this.refs.scrollView.scrollTo({x: 0, y: 0, animated: true})
  }
  renderHeader() {

    return (
      <HOCHeader title="Discuss" delegate={this} />
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
  renderList() {
    const { posts } = this.props;
    const { hasLoaded } = this.state;

    if (!hasLoaded) {
      return this.renderListLoader();
    }

    return (
      <ImmutableVirtualizedList
        ref="scrollView"
        style={styles.list}
        immutableData={posts}
        renderRow={this.renderFeedItem}
        onScroll={window.onScroll}
      />
    )
  }
  renderFAB() {
    return (
      <View style={styles.fabWrapper}>
        <RippleButton rippleColor={colors.bgColor} rippleOpacity={0.5} style={styles.fabButton} onPress={this.onNewPost}>
          <View style={styles.fabButton}>
            <Icon name="Plus" width="24" height="24" fill={colors.bgColor} />
          </View>
        </RippleButton>
      </View>
    );
  }
  render() {
    return (
      <View style={styles.container}>
        {this.renderHeader()}
        <View style={styles.list}>
          {this.renderList()}
        </View>
        {this.renderFAB()}
      </View>
    );
  }
}

export default PostFeed;
